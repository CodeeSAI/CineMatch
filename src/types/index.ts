// ─── App-level types (not TMDB API types — those live in services/tmdb/types.ts) ───

/** Slim movie record saved to localStorage — avoids storing full API response */
export interface SavedMovie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  genre_ids: number[]
}

/** Watchlist entry extends SavedMovie with timestamp for sorting */
export interface WatchlistItem extends SavedMovie {
  added_at: number // Date.now() timestamp
}

/** Personal star rating: 0.5 increments, 0 = unrated */
export type StarRating = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5

/** Local profile (no auth — stored in localStorage) */
export interface UserProfile {
  displayName: string
  avatarColor: string // hex color from preset palette
  favoriteGenreIds: number[]
  preferredLanguage: string // ISO 639-1, e.g. "en"
}

// UserPreferences intentionally merged into UserProfile to keep the localStorage shape simple.

/** Error categories returned by the TMDB client */
export type ApiErrorType =
  | 'MISSING_KEY'
  | 'INVALID_KEY'
  | 'RATE_LIMIT'
  | 'NETWORK'
  | 'GENERIC'

export class ApiError extends Error {
  constructor(
    public readonly type: ApiErrorType,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
