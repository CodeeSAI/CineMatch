// ─── TMDB API response types ───────────────────────────────────────────────────

export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  original_language: string
  adult: boolean
}

export interface TMDBGenre {
  id: number
  name: string
}

/** Full movie detail (from /movie/:id with append_to_response) */
export interface TMDBMovieDetail {
  id: number
  title: string
  tagline: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  runtime: number | null
  vote_average: number
  vote_count: number
  popularity: number
  genres: TMDBGenre[]
  original_language: string
  status: string
  budget: number
  revenue: number
  homepage: string
  imdb_id: string | null
  credits: TMDBCredits
  videos: TMDBVideosResult
  similar: TMDBPaginatedResponse<TMDBMovie>
  recommendations: TMDBPaginatedResponse<TMDBMovie>
}

export interface TMDBCredits {
  cast: TMDBCastMember[]
  crew: TMDBCrewMember[]
}

export interface TMDBCastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface TMDBCrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface TMDBVideo {
  id: string
  key: string          // YouTube video ID
  name: string
  site: string         // "YouTube", "Vimeo", etc.
  type: string         // "Trailer", "Teaser", "Clip", etc.
  official: boolean
  published_at: string
}

export interface TMDBVideosResult {
  results: TMDBVideo[]
}

export interface TMDBPaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface TMDBGenreListResponse {
  genres: TMDBGenre[]
}

/** Discover endpoint filter parameters */
export interface DiscoverFilters {
  with_genres?: string           // comma-separated genre IDs
  primary_release_year?: number
  'vote_average.gte'?: number
  'vote_average.lte'?: number
  with_original_language?: string
  'with_runtime.gte'?: number
  'with_runtime.lte'?: number
  sort_by?: string               // e.g. "popularity.desc"
  'vote_count.gte'?: number
  page?: number
}
