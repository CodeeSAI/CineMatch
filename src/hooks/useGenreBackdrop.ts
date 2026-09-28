import { useState, useEffect } from 'react'
import { discoverMovies } from '../services/tmdb/movies'
import { backdropUrl } from '../services/tmdb/images'
import { storageGet, storageSet } from '../services/storage/base'

interface CachedBackdrop {
  path: string
  timestamp: number
}

const CACHE_KEY_PREFIX = 'genre_backdrop_'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

function getCachedBackdrop(genreId: number): string | null {
  try {
    const cached = storageGet<CachedBackdrop | null>(`${CACHE_KEY_PREFIX}${genreId}`, null)
    if (cached && cached.path && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.path
    }
  } catch {
    // Gracefully ignore storage read errors
  }
  return null
}

function setCachedBackdrop(genreId: number, path: string): void {
  try {
    storageSet<CachedBackdrop>(`${CACHE_KEY_PREFIX}${genreId}`, {
      path,
      timestamp: Date.now(),
    })
  } catch {
    // Gracefully ignore storage write errors (e.g. quota/private mode)
  }
}

/**
 * Fetches and caches a popular movie backdrop for a genre.
 * Defers request until enabled (e.g. tile enters viewport via useInView).
 * Cached in localStorage with a 24-hour expiry to minimize TMDB API calls.
 */
export function useGenreBackdrop(
  genreId?: number,
  enabled: boolean = true,
  size: 'w300' | 'w500' | 'w780' | 'w1280' = 'w500'
) {
  // Check localStorage cache on initialization
  const initialCached = genreId ? getCachedBackdrop(genreId) : null
  const [backdrop, setBackdrop] = useState<string | null>(
    initialCached ? backdropUrl(initialCached, size) : null
  )
  const [loading, setLoading] = useState<boolean>(!initialCached && Boolean(genreId) && enabled)

  useEffect(() => {
    if (!genreId || !enabled) return

    // Recheck cache if genreId changed or enabled became true
    const cachedPath = getCachedBackdrop(genreId)
    if (cachedPath) {
      setBackdrop(backdropUrl(cachedPath, size))
      setLoading(false)
      return
    }

    const controller = new AbortController()
    setLoading(true)

    discoverMovies(
      {
        with_genres: String(genreId),
        sort_by: 'popularity.desc',
        'vote_count.gte': 200,
      },
      controller.signal
    )
      .then((res) => {
        // Find the first popular movie with a valid backdrop path
        const firstWithBackdrop = res.results?.find((m) => Boolean(m.backdrop_path))
        if (firstWithBackdrop?.backdrop_path) {
          setCachedBackdrop(genreId, firstWithBackdrop.backdrop_path)
          setBackdrop(backdropUrl(firstWithBackdrop.backdrop_path, size))
        }
      })
      .catch((err: unknown) => {
        // Ignore AbortError when unmounting; keep existing fallback on other errors
        if (err instanceof DOMException && err.name === 'AbortError') return
      })
      .finally(() => {
        setLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [genreId, enabled, size])

  return { backdropUrl: backdrop, loading }
}
