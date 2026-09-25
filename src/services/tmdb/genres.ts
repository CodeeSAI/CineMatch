import { tmdbFetch } from './client'
import type {
  TMDBGenreListResponse,
  TMDBGenre,
} from './types'

export async function getGenres(signal?: AbortSignal): Promise<TMDBGenre[]> {
  const res = await tmdbFetch<TMDBGenreListResponse>(
    '/genre/movie/list',
    { language: 'en-US' },
    signal,
  )
  return res.genres
}
