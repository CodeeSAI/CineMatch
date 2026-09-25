import { storageGet, storageSet } from './base'
import type { StarRating } from '../../types'

const KEY = 'ratings'

type RatingsMap = Record<number, StarRating>

export function getRatings(): RatingsMap {
  return storageGet<RatingsMap>(KEY, {})
}

export function getRating(id: number): StarRating {
  return getRatings()[id] ?? 0
}

export function setRating(id: number, rating: StarRating): void {
  const ratings = getRatings()
  if (rating === 0) {
    delete ratings[id]
  } else {
    ratings[id] = rating
  }
  storageSet(KEY, ratings)
}

/** Movies rated >= threshold (default 4 stars) — used as recommendation seeds */
export function getHighlyRatedMovieIds(threshold: StarRating = 4): number[] {
  const ratings = getRatings()
  return Object.entries(ratings)
    .filter(([, rating]) => rating >= threshold)
    .map(([id]) => Number(id))
}
