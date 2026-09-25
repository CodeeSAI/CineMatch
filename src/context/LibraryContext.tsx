import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'
import { Heart, Bookmark } from 'lucide-react'
import type { SavedMovie, WatchlistItem, StarRating } from '../types'
import * as favoritesStorage from '../services/storage/favorites'
import * as watchlistStorage from '../services/storage/watchlist'
import * as ratingsStorage from '../services/storage/ratings'
import * as recentlyViewedStorage from '../services/storage/recentlyViewed'

interface ToastState {
  message: string
  type?: 'favorite' | 'watchlist' | 'info'
}

interface LibraryContextValue {
  // Favorites
  favorites: SavedMovie[]
  addFavorite: (movie: SavedMovie) => void
  removeFavorite: (id: number) => void
  isFavorite: (id: number) => boolean

  // Watchlist
  watchlist: WatchlistItem[]
  addToWatchlist: (movie: SavedMovie) => void
  removeFromWatchlist: (id: number) => void
  isInWatchlist: (id: number) => boolean

  // Personal ratings (1-5 stars, half steps)
  ratings: Record<number, StarRating>
  setRating: (id: number, rating: StarRating) => void
  getRating: (id: number) => StarRating

  // Recently viewed
  recentlyViewed: SavedMovie[]
  recordView: (movie: SavedMovie) => void

  // Toast
  showToast: (message: string, type?: 'favorite' | 'watchlist' | 'info') => void
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<SavedMovie[]>(() => favoritesStorage.getFavorites())
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => watchlistStorage.getWatchlist())
  const [ratings, setRatings] = useState<Record<number, StarRating>>(() => ratingsStorage.getRatings())
  const [recentlyViewed, setRecentlyViewed] = useState<SavedMovie[]>(() =>
    recentlyViewedStorage.getRecentlyViewed(),
  )

  const [toast, setToast] = useState<ToastState | null>(null)
  const toastTimeoutRef = useRef<number | null>(null)

  const showToast = useCallback((message: string, type: 'favorite' | 'watchlist' | 'info' = 'info') => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current)
    }
    setToast({ message, type })
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null)
    }, 2500)
  }, [])

  // ── Favorites ──────────────────────────────────────────
  const addFavorite = useCallback((movie: SavedMovie) => {
    favoritesStorage.addFavorite(movie)
    setFavorites(favoritesStorage.getFavorites())
    showToast('Added to Favourites', 'favorite')
  }, [showToast])

  const removeFavorite = useCallback((id: number) => {
    favoritesStorage.removeFavorite(id)
    setFavorites(favoritesStorage.getFavorites())
    showToast('Removed from Favourites', 'favorite')
  }, [showToast])

  const isFavorite = useCallback(
    (id: number) => favorites.some((m) => m.id === id),
    [favorites],
  )

  // ── Watchlist ──────────────────────────────────────────
  const addToWatchlist = useCallback((movie: SavedMovie) => {
    watchlistStorage.addToWatchlist(movie)
    setWatchlist(watchlistStorage.getWatchlist())
    showToast('Added to Watchlist', 'watchlist')
  }, [showToast])

  const removeFromWatchlist = useCallback((id: number) => {
    watchlistStorage.removeFromWatchlist(id)
    setWatchlist(watchlistStorage.getWatchlist())
    showToast('Removed from Watchlist', 'watchlist')
  }, [showToast])

  const isInWatchlist = useCallback(
    (id: number) => watchlist.some((m) => m.id === id),
    [watchlist],
  )

  // ── Ratings ────────────────────────────────────────────
  const setRating = useCallback((id: number, rating: StarRating) => {
    ratingsStorage.setRating(id, rating)
    setRatings(ratingsStorage.getRatings())
    if (rating > 0) {
      showToast(`Rated ${rating} Stars`, 'info')
    } else {
      showToast('Rating cleared', 'info')
    }
  }, [showToast])

  const getRating = useCallback(
    (id: number): StarRating => ratings[id] ?? 0,
    [ratings],
  )

  // ── Recently viewed ────────────────────────────────────
  const recordView = useCallback((movie: SavedMovie) => {
    recentlyViewedStorage.recordView(movie)
    setRecentlyViewed(recentlyViewedStorage.getRecentlyViewed())
  }, [])

  return (
    <LibraryContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        ratings,
        setRating,
        getRating,
        recentlyViewed,
        recordView,
        showToast,
      }}
    >
      {children}

      {/* Floating 2.5s glass toast notification */}
      {toast && (
        <div className="toast glass-strong" role="status" aria-live="polite">
          {toast.type === 'favorite' && (
            <Heart size={16} fill="var(--color-rose)" color="var(--color-rose)" />
          )}
          {toast.type === 'watchlist' && (
            <Bookmark size={16} fill="var(--color-accent)" color="var(--color-accent)" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </LibraryContext.Provider>
  )
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider')
  return ctx
}
