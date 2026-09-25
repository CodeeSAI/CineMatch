import { storageGet, storageSet } from './base'
import type { SavedMovie } from '../../types'

const KEY = 'favorites'

export function getFavorites(): SavedMovie[] {
  return storageGet<SavedMovie[]>(KEY, [])
}

export function addFavorite(movie: SavedMovie): void {
  const list = getFavorites()
  if (list.some((m) => m.id === movie.id)) return
  storageSet(KEY, [...list, movie])
}

export function removeFavorite(id: number): void {
  storageSet(KEY, getFavorites().filter((m) => m.id !== id))
}

export function isFavorite(id: number): boolean {
  return getFavorites().some((m) => m.id === id)
}
