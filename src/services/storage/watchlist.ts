import { storageGet, storageSet } from './base'
import type { WatchlistItem, SavedMovie } from '../../types'

const KEY = 'watchlist'

export function getWatchlist(): WatchlistItem[] {
  return storageGet<WatchlistItem[]>(KEY, [])
}

export function addToWatchlist(movie: SavedMovie): void {
  const list = getWatchlist()
  if (list.some((m) => m.id === movie.id)) return
  const item: WatchlistItem = { ...movie, added_at: Date.now() }
  storageSet(KEY, [...list, item])
}

export function removeFromWatchlist(id: number): void {
  storageSet(KEY, getWatchlist().filter((m) => m.id !== id))
}

export function isInWatchlist(id: number): boolean {
  return getWatchlist().some((m) => m.id === id)
}
