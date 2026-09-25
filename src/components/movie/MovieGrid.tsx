import { MovieCard } from './MovieCard'
import type { TMDBMovie } from '../../services/tmdb/types'

interface Props {
  movies: TMDBMovie[]
}

/** Responsive CSS grid of MovieCards — 2 cols mobile → 6 cols desktop */
export function MovieGrid({ movies }: Props) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
