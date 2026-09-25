import { tmdbFetch } from './client'
import type {
  TMDBMovie,
  TMDBMovieDetail,
  TMDBPaginatedResponse,
  DiscoverFilters,
} from './types'

export function getTrending(
  timeWindow: 'day' | 'week' = 'week',
  signal?: AbortSignal,
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch(`/trending/movie/${timeWindow}`, { language: 'en-US' }, signal)
}

export function getPopular(page = 1, signal?: AbortSignal): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch('/movie/popular', { language: 'en-US', page }, signal)
}

export function getTopRated(page = 1, signal?: AbortSignal): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch('/movie/top_rated', { language: 'en-US', page }, signal)
}

export function getUpcoming(page = 1, signal?: AbortSignal): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch('/movie/upcoming', { language: 'en-US', page }, signal)
}

export function searchMovies(
  query: string,
  page = 1,
  signal?: AbortSignal,
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch('/search/movie', { query, page, language: 'en-US', include_adult: false }, signal)
}

/** Full detail with credits, videos, similar, and recommendations in one request */
export function getMovieDetails(id: number, signal?: AbortSignal): Promise<TMDBMovieDetail> {
  return tmdbFetch(
    `/movie/${id}`,
    { language: 'en-US', append_to_response: 'credits,videos,similar,recommendations' },
    signal,
  )
}

export function getSimilarMovies(
  id: number,
  page = 1,
  signal?: AbortSignal,
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch(`/movie/${id}/similar`, { language: 'en-US', page }, signal)
}

export function getRecommendedMovies(
  id: number,
  page = 1,
  signal?: AbortSignal,
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return tmdbFetch(`/movie/${id}/recommendations`, { language: 'en-US', page }, signal)
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
      params[k] = v as string | number | boolean
    }
  }
  return tmdbFetch('/discover/movie', params, signal)
}
