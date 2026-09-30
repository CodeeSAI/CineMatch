import { ApiError } from '../../types'

const BASE_URL = 'https://api.themoviedb.org/3'

// Cache entry with timestamp and expiration
interface CacheEntry<T> {
  data: T
  expiresAt: number
}

// In-memory response cache: cacheKey -> CacheEntry
const responseCache = new Map<string, CacheEntry<unknown>>()

// In-flight promises map for request deduplication: cacheKey -> Promise<T>
const inFlightRequests = new Map<string, Promise<unknown>>()

// Rate-limiting / 429 cooldown timestamp
let rateLimitCooldownUntil = 0

// Default TTLs by endpoint pattern (ms)
const DEFAULT_TTL_MS = 5 * 60 * 1000 // 5 minutes default
const GENRE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours for genre lists
const MOVIE_DETAIL_TTL_MS = 10 * 60 * 1000 // 10 minutes for movie details
const SEARCH_TTL_MS = 2 * 60 * 1000 // 2 minutes for search queries

function getTtlForPath(path: string): number {
  if (path.startsWith('/genre/')) return GENRE_TTL_MS
  if (path.startsWith('/movie/')) return MOVIE_DETAIL_TTL_MS
  if (path.startsWith('/search/')) return SEARCH_TTL_MS
  return DEFAULT_TTL_MS
}

function getApiKey(): string {
  const key = import.meta.env.VITE_TMDB_API_KEY
  if (!key || key === 'your_tmdb_api_key_here') {
    throw new ApiError('MISSING_KEY', 'TMDB API key is not configured.')
  }
  return key as string
}

export interface TmdbFetchOptions {
  forceRefresh?: boolean
  ttl?: number
  maxRetries?: number
}

/** Cache and request statistics for auditing */
export function getTmdbCacheStats() {
  return {
    cachedEntries: responseCache.size,
    inFlightCount: inFlightRequests.size,
    isRateLimited: Date.now() < rateLimitCooldownUntil,
    cooldownRemainingMs: Math.max(0, rateLimitCooldownUntil - Date.now()),
  }
}

/** Clears memory cache (e.g. for testing) */
export function clearTmdbCache() {
  responseCache.clear()
  inFlightRequests.clear()
  rateLimitCooldownUntil = 0
}

/**
 * Hardened TMDB fetch engine:
 * 1. In-flight request deduplication across components and renders.
 * 2. In-memory response caching with configurable TTL (even with AbortSignal).
 * 3. 429 Rate-limit protection with Retry-After inspection and automatic cooldown.
 * 4. Maximum retry cap with exponential backoff (no infinite retry storms).
 * 5. Request timeout handling (10s safety limit).
 * 6. Zero out-of-pocket cost guarantee: 100% free TMDB public tier.
 */
export async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | boolean> = {},
  signal?: AbortSignal,
  options: TmdbFetchOptions = {},
): Promise<T> {
  const apiKey = getApiKey() // throws MISSING_KEY if absent

  // Build canonical URL
  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', apiKey)

  // Sort parameters for deterministic cache keys
  const sortedEntries = Object.entries(params).sort(([a], [b]) => a.localeCompare(b))
  for (const [k, v] of sortedEntries) {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v))
    }
  }

  // Canonical cache key (protects API key from exposure in cache keys)
  const cacheKey = `${path}?${new URLSearchParams(
    sortedEntries.map(([k, v]) => [k, String(v)]),
  ).toString()}`

  // 1. Check Rate-Limit Cooldown
  const now = Date.now()
  if (now < rateLimitCooldownUntil) {
    const waitSec = Math.ceil((rateLimitCooldownUntil - now) / 1000)
    throw new ApiError(
      'RATE_LIMIT',
      `TMDB rate limit active. Please wait ${waitSec}s before retrying.`,
    )
  }

  // 2. Check Fresh Cache (unless forceRefresh is requested)
  if (!options.forceRefresh) {
    const cached = responseCache.get(cacheKey)
    if (cached && cached.expiresAt > now) {
      return cached.data as T
    }
  }

  // 3. Deduplicate In-Flight Requests or Launch Fetch
  let fetchPromise = inFlightRequests.get(cacheKey) as Promise<T> | undefined

  if (!fetchPromise || options.forceRefresh) {
    const ttl = options.ttl ?? getTtlForPath(path)
    const maxRetries = options.maxRetries ?? 1

    fetchPromise = (async () => {
      let attempt = 0
      let lastError: unknown

      while (attempt <= maxRetries) {
        // Check Rate Limit Cooldown before attempt
        if (Date.now() < rateLimitCooldownUntil) {
          throw new ApiError('RATE_LIMIT', 'TMDB rate limit active. Cooling down.')
        }

        const timeoutController = new AbortController()
        const timeoutId = setTimeout(() => timeoutController.abort(), 10000) // 10s safety timeout

        try {
          const res = await fetch(url.toString(), {
            signal: timeoutController.signal,
            headers: {
              Accept: 'application/json',
            },
          })

          clearTimeout(timeoutId)

          if (!res.ok) {
            if (res.status === 401) {
              throw new ApiError('INVALID_KEY', 'Invalid TMDB API key (401). Check your .env setup.')
            }
            if (res.status === 429) {
              const retryHeader = res.headers.get('Retry-After')
              const retrySeconds = retryHeader ? parseInt(retryHeader, 10) : 5
              const cooldownMs = isNaN(retrySeconds)
                ? 5000
                : Math.min(Math.max(retrySeconds * 1000, 2000), 30000)
              rateLimitCooldownUntil = Date.now() + cooldownMs

              if (attempt < maxRetries) {
                attempt++
                await new Promise((r) => setTimeout(r, 1500))
                continue
              }
              throw new ApiError(
                'RATE_LIMIT',
                'TMDB rate limit reached. Please wait a moment before retrying.',
              )
            }

            if (res.status >= 500 && attempt < maxRetries) {
              attempt++
              await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)))
              continue
            }

            throw new ApiError('GENERIC', `TMDB API error: ${res.status} ${res.statusText}`)
          }

          const data = (await res.json()) as T

          // Store in cache with TTL
          responseCache.set(cacheKey, {
            data,
            expiresAt: Date.now() + ttl,
          })

          return data
        } catch (err: unknown) {
          clearTimeout(timeoutId)

          if (err instanceof ApiError) {
            throw err
          }

          if (err instanceof DOMException && err.name === 'AbortError') {
            // Internal 10s timeout occurred
            throw new ApiError('NETWORK', 'Request timed out. Please check your network connection.')
          }

          lastError = err

          // Retry once on unexpected network hiccup if retries left
          if (attempt < maxRetries) {
            attempt++
            await new Promise((r) => setTimeout(r, 1000))
            continue
          }

          throw new ApiError('NETWORK', 'Network request failed. Check your internet connection.')
        }
      }

      throw lastError instanceof ApiError
        ? lastError
        : new ApiError('NETWORK', 'Request failed after retries.')
    })()

    inFlightRequests.set(cacheKey, fetchPromise)

    // Ensure inFlight tracker is cleared when done
    fetchPromise.finally(() => {
      inFlightRequests.delete(cacheKey)
    })
  }

  // 4. Return shared promise wrapped in caller's abort signal if supplied
  if (signal) {
    return new Promise<T>((resolve, reject) => {
      if (signal.aborted) {
        return reject(new DOMException('The user aborted a request.', 'AbortError'))
      }
      const onAbort = () => reject(new DOMException('The user aborted a request.', 'AbortError'))
      signal.addEventListener('abort', onAbort, { once: true })

      fetchPromise!
        .then((res) => {
          signal.removeEventListener('abort', onAbort)
          resolve(res)
        })
        .catch((err) => {
          signal.removeEventListener('abort', onAbort)
          reject(err)
        })
    })
  }

  return fetchPromise
}
