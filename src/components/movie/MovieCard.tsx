import type { MouseEvent as ReactMouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Bookmark, Star } from 'lucide-react'
import { ImageWithFallback } from '../ui/ImageWithFallback'
import { GenreTag } from '../ui/GenreTag'
import { useLibrary } from '../../context/LibraryContext'
import { useGenres } from '../../context/GenresContext'
import { posterUrl } from '../../services/tmdb/images'
import { formatYear, formatRating } from '../../lib/format'
import { toSavedMovie } from '../../lib/movie'
import type { TMDBMovie } from '../../services/tmdb/types'

interface Props {
  movie: TMDBMovie
  reason?: string
}

export function MovieCard({ movie, reason }: Props) {
  const {
    isFavorite,
    addFavorite,
    removeFavorite,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
  } = useLibrary()
  const { getGenreName } = useGenres()

  const fav = isFavorite(movie.id)
  const wl = isInWatchlist(movie.id)
  const firstGenre = movie.genre_ids?.[0] ? getGenreName(movie.genre_ids[0]) : null
  const year = formatYear(movie.release_date)
  const rating = formatRating(movie.vote_average)
  const poster = posterUrl(movie.poster_path, 'w342')

  function handleFav(e: ReactMouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    fav ? removeFavorite(movie.id) : addFavorite(toSavedMovie(movie))
  }

  function handleWl(e: ReactMouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    wl ? removeFromWatchlist(movie.id) : addToWatchlist(toSavedMovie(movie))
  }

  return (
    <Link
      to={`/movie/${movie.id}`}
      aria-label={`${movie.title} (${year})`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <article className="movie-card">
        {/* 2:3 Poster with Rating Badge, Overlay & Action Buttons */}
        <div className="movie-card__poster poster-ratio">
          <ImageWithFallback
            src={poster}
            alt={`${movie.title} poster`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* Rating badge top-left */}
          <div className="movie-card__rating-badge" aria-label={`Rating: ${rating} out of 10`}>
            <Star size={11} fill="currentColor" />
            <span>{rating}</span>
          </div>

          {/* Gradient hover overlay */}
          <div className="movie-card__overlay" aria-hidden="true" />

          {/* Round action buttons top-right (rose for heart, gold for bookmark) */}
          <div className="movie-card__actions">
            <button
              type="button"
              onClick={handleFav}
              aria-label={fav ? `Remove ${movie.title} from favourites` : `Add ${movie.title} to favourites`}
              aria-pressed={fav}
              className={`movie-card__btn${fav ? ' movie-card__btn--active-rose' : ''}`}
            >
              <Heart size={15} fill={fav ? 'currentColor' : 'none'} />
            </button>
            <button
              type="button"
              onClick={handleWl}
              aria-label={wl ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
              aria-pressed={wl}
              className={`movie-card__btn${wl ? ' movie-card__btn--active-gold' : ''}`}
            >
              <Bookmark size={15} fill={wl ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Info section */}
        <div className="movie-card__info">
          <h3 className="movie-card__title line-clamp-2">{movie.title}</h3>
          <div className="movie-card__meta">
            <span className="movie-card__year">{year}</span>
            {firstGenre && <GenreTag label={firstGenre} small />}
          </div>

          {reason && (
            <p
              style={{
                fontSize: 11,
                color: 'var(--color-accent)',
                marginTop: 6,
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {reason}
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}
