import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { getGenres } from '../services/tmdb/genres'
import type { TMDBGenre } from '../services/tmdb/types'

interface GenresContextValue {
  genres: TMDBGenre[]
  getGenreName: (id: number) => string
  loading: boolean
}

const GenresContext = createContext<GenresContextValue>({
  genres: [],
  getGenreName: () => '',
  loading: true,
})

export function GenresProvider({ children }: { children: ReactNode }) {
  const [genres, setGenres] = useState<TMDBGenre[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    getGenres(controller.signal)
      .then((list) => {
        if (!controller.signal.aborted) {
          setGenres(list)
          setLoading(false)
        }
      })
      .catch(() => {
        // Genre list is non-critical; fail silently and show IDs as fallback
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  const getGenreName = (id: number): string => {
    return genres.find((g) => g.id === id)?.name ?? String(id)
  }

  return (
    <GenresContext.Provider value={{ genres, getGenreName, loading }}>
      {children}
    </GenresContext.Provider>
  )
}

export function useGenres(): GenresContextValue {
  return useContext(GenresContext)
}
