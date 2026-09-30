import { tmdbFetch } from './client'
import type {
  TMDBMovie,
  TMDBMovieDetail,
  TMDBPaginatedResponse,
  DiscoverFilters,
} from './types'

/** Clamp page numbers to safe bounds (1 - 50) to prevent abuse or runaway pagination */
function clampPage(page = 1, max = 50): number {
  if (isNaN(page) || page < 1) return 1
  return Math.min(Math.floor(page), max)
}

export function getTrending(
  timeWindow: 'day' | 'week' = 'week',
  signal?: AbortSignal,
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch(`/trending/movie/${timeWindow}`, { language: 'en-US' }, signal)
}

export function getPopular(page = 1, signal?: AbortSignal): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch('/movie/popular', { language: 'en-US', page: clampPage(page) }, signal)
}

export function getTopRated(page = 1, signal?: AbortSignal): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch('/movie/top_rated', { language: 'en-US', page: clampPage(page) }, signal)
}

export function getUpcoming(page = 1, signal?: AbortSignal): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch('/movie/upcoming', { language: 'en-US', page: clampPage(page) }, signal)
}

export function searchMovies(
  query: string,
  page = 1,
  signal?: AbortSignal,
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const safeQuery = query.trim().slice(0, 100)
  return tmdbFetch(
    '/search/movie',
    { query: safeQuery, page: clampPage(page, 20), language: 'en-US', include_adult: false },
    signal,
  )
}

/** Full detail with credits, videos, similar, and recommendations in one request */
export function getMovieDetails(id: number, signal?: AbortSignal): Promise<TMDBMovieDetail> {
  const safeId = Math.floor(Math.abs(id))
  return tmdbFetch(
    `/movie/${safeId}`,
    { language: 'en-US', append_to_response: 'credits,videos,similar,recommendations' },
    signal,
  )
}

export function getSimilarMovies(
  id: number,
  page = 1,
  signal?: AbortSignal,
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const safeId = Math.floor(Math.abs(id))
  return tmdbFetch(`/movie/${safeId}/similar`, { language: 'en-US', page: clampPage(page, 10) }, signal)
}

export function getRecommendedMovies(
  id: number,
  page = 1,
  signal?: AbortSignal,
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const safeId = Math.floor(Math.abs(id))
  return tmdbFetch(`/movie/${safeId}/recommendations`, { language: 'en-US', page: clampPage(page, 10) }, signal)
}

export function discoverMovies(
  filters: DiscoverFilters,
  signal?: AbortSignal,
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  // Convert typed filter object to string params for tmdbFetch
  const params: Record<string, string | number | boolean> = {
    language: 'en-US',
    include_adult: false,
  }
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== '' && v !== null) {
      if (k === 'page') {
        params[k] = clampPage(Number(v), 50)
      } else {
        params[k] = v as string | number | boolean
      }
    }
  }
  return tmdbFetch('/discover/movie', params, signal)
}
