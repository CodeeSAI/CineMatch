import type { TMDBMovie, TMDBMovieDetail } from '../services/tmdb/types'
import type { SavedMovie } from '../types'

/**
 * Converts a TMDBMovie to the slim SavedMovie shape stored in localStorage.
 * Called from MovieCard and HeroSection when the user saves a movie.
 */
export function toSavedMovie(movie: TMDBMovie): SavedMovie {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    genre_ids: movie.genre_ids,
  }
}

/**
 * Converts TMDBMovieDetail to SavedMovie.
 * Normalises the genres array (which is TMDBGenre[]) to genre_ids (number[]).
 * Used on the MovieDetails page when saving from the detail view.
 */
export function detailToSavedMovie(movie: TMDBMovieDetail): SavedMovie {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    genre_ids: movie.genres.map((g) => g.id), // normalise genres → genre_ids
  }
}
