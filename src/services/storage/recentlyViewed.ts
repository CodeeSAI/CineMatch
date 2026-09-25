import { storageGet, storageSet } from './base'
import type { SavedMovie } from '../../types'

const KEY = 'recently_viewed'
const MAX_ITEMS = 20

export function getRecentlyViewed(): SavedMovie[] {
  return storageGet<SavedMovie[]>(KEY, [])
}

/** Adds movie to front of list; deduplicates; caps at MAX_ITEMS */
export function recordView(movie: SavedMovie): void {
  const list = getRecentlyViewed().filter((m) => m.id !== movie.id)
  storageSet(KEY, [movie, ...list].slice(0, MAX_ITEMS))
}
