import { ApiError } from '../../types'

const BASE_URL = 'https://api.themoviedb.org/3'

// In-memory cache: only successful responses are stored.
// Failed or aborted requests are removed so Retry works correctly.
const cache = new Map<string, Promise<unknown>>()

function getApiKey(): string {
  const key = import.meta.env.VITE_TMDB_API_KEY
  if (!key || key === 'your_tmdb_api_key_here') {
    throw new ApiError('MISSING_KEY', 'TMDB API key is not configured.')
  }
  return key as string
}

/**
 * Core fetch wrapper.
 * - Caches successful responses only.
 * - Accepts an optional AbortSignal; each caller passes its own signal,
 *   so signals are never shared between callers.
 * - Throws typed ApiError for all error conditions.
 */
export async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | boolean> = {},
  signal?: AbortSignal,
): Promise<T> {
  const apiKey = getApiKey() // throws MISSING_KEY if absent

  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', apiKey)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v))
  }
  const cacheKey = url.toString()

  // Return cached successful response if available and no abort signal
  // (signals mean caller wants a fresh, cancellable request)
  if (!signal && cache.has(cacheKey)) {
    return cache.get(cacheKey) as Promise<T>
  }

  const request = fetch(url.toString(), { signal })
    .then(async (res) => {
      if (!res.ok) {
        cache.delete(cacheKey) // remove from cache on failure
        if (res.status === 401) throw new ApiError('INVALID_KEY', 'Invalid TMDB API key (401).')
        if (res.status === 429) throw new ApiError('RATE_LIMIT', 'TMDB rate limit reached. Please wait.')
        throw new ApiError('GENERIC', `TMDB API error: ${res.status} ${res.statusText}`)
      }
      return res.json() as Promise<T>
    })
    .catch((err: unknown) => {
      cache.delete(cacheKey) // remove from cache on abort or network error
      if (err instanceof ApiError) throw err
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw err // re-throw abort as-is so callers can detect it
      }
      throw new ApiError('NETWORK', 'Network request failed. Check your connection.')
    })

  // Only cache if there's no abort signal
  if (!signal) {
    cache.set(cacheKey, request)
  }

  return request as Promise<T>
}
