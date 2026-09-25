// ─── Rule-based recommendation engine ─────────────────────────────────────────
// Rule-based heuristic scoring based on local user library (not AI/ML).
//
// Seeds: favorites + movies rated >= 4 stars (up to MAX_SEEDS)
// Genre profile: built from seeds + watchlist + profile favorite genres
// Exclusions: candidates already in favorites, watchlist, or rated
// Scoring: 0.40 genre match + 0.30 vote average + 0.20 seed overlap + 0.10 popularity
// Candidates with < 100 votes are dropped. Preferred language gives a small boost.

import { getFavorites } from '../services/storage/favorites'
import { getWatchlist } from '../services/storage/watchlist'
import { getRatings, getHighlyRatedMovieIds } from '../services/storage/ratings'
import { getProfile } from '../services/storage/profile'
import { getRecentlyViewed } from '../services/storage/recentlyViewed'
import {
  getRecommendedMovies,
  getSimilarMovies,
  discoverMovies,
} from '../services/tmdb/movies'
import type { TMDBMovie } from '../services/tmdb/types'

// Scoring weight constants (must sum to 1.0)
export const GENRE_MATCH_WEIGHT   = 0.40
export const RATING_WEIGHT        = 0.30
export const SEED_OVERLAP_WEIGHT  = 0.20
export const POPULARITY_WEIGHT    = 0.10

export const MIN_VOTES_THRESHOLD  = 100  // candidates below this are dropped
export const MAX_SEEDS            = 3    // number of seed movies used
export const LANGUAGE_BOOST       = 0.05 // added to score when language matches

export interface RecommendedMovie extends TMDBMovie {
  reason?: string
}

export interface RecommendResult {
  movies: RecommendedMovie[]
  reason: string   // e.g. "Because you liked Inception"
  sharedGenres: string[]
}

export async function getRecommendations(
  signal?: AbortSignal,
): Promise<RecommendResult | null> {
  const favorites = getFavorites()
  const highRatedIds = getHighlyRatedMovieIds(4)
  const watchlist = getWatchlist()
  const profile = getProfile()
  const recentlyViewed = getRecentlyViewed()
  const allRatings = getRatings()

  // If user has saved nothing at all, do not show recommendations
  if (
    favorites.length === 0 &&
    highRatedIds.length === 0 &&
    watchlist.length === 0 &&
    profile.favoriteGenreIds.length === 0
  ) {
    return null
  }

  // ── 1. Gather Seeds (Favorites + movies rated >= 4 stars) ──
  const seedMap = new Map<number, { id: number; title: string; genre_ids: number[] }>()

  // Add favorites as seeds
  for (const fav of favorites) {
    seedMap.set(fav.id, { id: fav.id, title: fav.title, genre_ids: fav.genre_ids })
  }

  // Add highly rated movies from recently viewed / watchlist
  for (const rv of recentlyViewed) {
    if (highRatedIds.includes(rv.id) && !seedMap.has(rv.id)) {
      seedMap.set(rv.id, { id: rv.id, title: rv.title, genre_ids: rv.genre_ids })
    }
  }
  for (const wl of watchlist) {
    if (highRatedIds.includes(wl.id) && !seedMap.has(wl.id)) {
      seedMap.set(wl.id, { id: wl.id, title: wl.title, genre_ids: wl.genre_ids })
    }
  }

  const seeds = Array.from(seedMap.values()).slice(0, MAX_SEEDS)

  // ── 2. Exclusions (already saved or rated) ──
  const excludedIds = new Set<number>([
    ...favorites.map((m) => m.id),
    ...watchlist.map((m) => m.id),
    ...Object.keys(allRatings).map(Number),
  ])

  // ── 3. Build Genre Profile ──
  // Watchlist only feeds the genre profile and exclusions
  // Profile favorite genres also add to the genre profile
  const genreSet = new Set<number>()
  for (const seed of seeds) {
    for (const gid of seed.genre_ids) genreSet.add(gid)
  }
  for (const w of watchlist) {
    for (const gid of w.genre_ids) genreSet.add(gid)
  }
  for (const gid of profile.favoriteGenreIds) {
    genreSet.add(gid)
  }

  // ── 4. Candidate Pool ──
  const candidateMap = new Map<number, TMDBMovie>()
  const seedRecommenders = new Map<number, number>() // count how many seeds suggested this candidate

  if (seeds.length > 0) {
    // Fetch recommendations & similar for each seed in parallel
    await Promise.all(
      seeds.map(async (seed) => {
        try {
          const [recRes, simRes] = await Promise.all([
            getRecommendedMovies(seed.id, 1, signal).catch(() => null),
            getSimilarMovies(seed.id, 1, signal).catch(() => null),
          ])

          const list = [
            ...(recRes?.results ?? []),
            ...(simRes?.results ?? []),
          ]

          for (const movie of list) {
            if (!candidateMap.has(movie.id)) {
              candidateMap.set(movie.id, movie)
            }
            seedRecommenders.set(movie.id, (seedRecommenders.get(movie.id) || 0) + 1)
          }
        } catch {
          // ignore individual fetch errors
        }
      }),
    )
  } else if (genreSet.size > 0) {
    // If no movie seeds exist but user has watchlist or profile favorite genres
    try {
      const disc = await discoverMovies(
        {
          with_genres: Array.from(genreSet).slice(0, 3).join(','),
          sort_by: 'vote_average.desc',
          'vote_count.gte': MIN_VOTES_THRESHOLD,
        },
        signal,
      )
      for (const m of disc.results) {
        candidateMap.set(m.id, m)
        seedRecommenders.set(m.id, 1)
      }
    } catch {
      // fallback fail silently
    }
  }

  if (candidateMap.size === 0) {
    return null
  }

  // ── 5. Score Candidates ──
  const scoredList: { movie: RecommendedMovie; score: number }[] = []
  const primarySeedTitle = seeds[0]?.title ?? ''

  for (const candidate of candidateMap.values()) {
    // Skip if in exclusions or below minimum votes threshold
    if (excludedIds.has(candidate.id)) continue
    if (candidate.vote_count < MIN_VOTES_THRESHOLD) continue

    // 0.40 Genre match
    const candidateGenres = candidate.genre_ids || []
    const matchingGenres = candidateGenres.filter((gid) => genreSet.has(gid)).length
    const genreMatchScore =
      candidateGenres.length > 0 ? matchingGenres / candidateGenres.length : 0

    // 0.30 Vote average (scaled 0-1)
    const ratingScore = Math.min((candidate.vote_average || 0) / 10, 1.0)

    // 0.20 Seed overlap (fraction of seeds that recommended this candidate)
    const seedsCount = seedRecommenders.get(candidate.id) || 1
    const seedOverlapScore = seeds.length > 0 ? seedsCount / seeds.length : 0.5

    // 0.10 Popularity (normalized 0-1)
    const popularityScore = Math.min((candidate.popularity || 0) / 100, 1.0)

    // Language boost
    const langBoost =
      candidate.original_language === profile.preferredLanguage ? LANGUAGE_BOOST : 0

    // Final weighted score
    const totalScore =
      GENRE_MATCH_WEIGHT * genreMatchScore +
      RATING_WEIGHT * ratingScore +
      SEED_OVERLAP_WEIGHT * seedOverlapScore +
      POPULARITY_WEIGHT * popularityScore +
      langBoost

    // Short reason under each movie
    const reasonText = primarySeedTitle
      ? `Because you liked ${primarySeedTitle}`
      : `Matches your favorite genres`

    scoredList.push({
      movie: { ...candidate, reason: reasonText },
      score: totalScore,
    })
  }

  if (scoredList.length === 0) {
    return null
  }

  // Sort descending by score
  scoredList.sort((a, b) => b.score - a.score)

  const finalMovies = scoredList.slice(0, 15).map((s) => s.movie)
  const headerReason = primarySeedTitle
    ? `Because you liked ${primarySeedTitle}`
    : `Recommended For You`

  return {
    movies: finalMovies,
    reason: headerReason,
    sharedGenres: [],
  }
}
