import { useState, type MouseEvent as ReactMouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Bookmark, Star } from 'lucide-react'
import { ImageWithFallback } from '../ui/ImageWithFallback'
import { GenreTag } from '../ui/GenreTag'
import { useLibrary } from '../../context/LibraryContext'
import { useGenres } from '../../context/GenresContext'
import { useInView } from '../../hooks/useInView'
import { posterUrl } from '../../services/tmdb/images'
import { formatYear, formatRating } from '../../lib/format'
import { toSavedMovie } from '../../lib/movie'
import { getGenreColor } from '../../lib/genreColors'
import type { TMDBMovie } from '../../services/tmdb/types'

interface Props {
  movie: TMDBMovie
  reason?: string
  index?: number
}

export function MovieCard({ movie, reason, index = 0 }: Props) {
  const {
    isFavorite,
    addFavorite,
    removeFavorite,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
  } = useLibrary()
  const { getGenreName } = useGenres()
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.05 })

  const [heartPopping, setHeartPopping] = useState(false)
  const [ringBurst, setRingBurst] = useState(false)
  const [bookmarkBouncing, setBookmarkBouncing] = useState(false)

  const fav = isFavorite(movie.id)
  const wl = isInWatchlist(movie.id)
  const firstGenre = movie.genre_ids?.[0] ? getGenreName(movie.genre_ids[0]) : null
  const genreSpec = getGenreColor(firstGenre ?? undefined)
  const year = formatYear(movie.release_date)
  const rating = formatRating(movie.vote_average)
  const poster = posterUrl(movie.poster_path, 'w342')

  function handleFav(e: ReactMouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (fav) {
      removeFavorite(movie.id)
    } else {
      addFavorite(toSavedMovie(movie))
      setHeartPopping(true)
      setRingBurst(true)
      setTimeout(() => setHeartPopping(false), 320)
      setTimeout(() => setRingBurst(false), 450)
    }
  }

  function handleWl(e: ReactMouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (wl) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(toSavedMovie(movie))
      setBookmarkBouncing(true)
      setTimeout(() => setBookmarkBouncing(false), 350)
    }
  }

  return (
    <div
      ref={ref}
      className={`reveal ${isInView ? 'is-in-view' : ''}`}
      style={{ '--i': index % 10 } as React.CSSProperties}
    >
      <Link
        to={`/movie/${movie.id}`}
        aria-label={`${movie.title} (${year})`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <article
          className="movie-card"
          style={
            {
              '--genre-glow': genreSpec.glow,
              '--genre-accent': genreSpec.accent,
            } as React.CSSProperties
          }
        >
          {/* 2:3 Poster with Rating Badge, Overlay & Action Buttons */}
          <div className="movie-card__poster poster-ratio">
            <ImageWithFallback
              src={poster}
              alt={`${movie.title} poster`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />

            {/* Gradient rating badge top-left */}
            <div className="movie-card__rating-badge" aria-label={`Rating: ${rating} out of 10`}>
              <Star size={11} fill="currentColor" strokeWidth={0} />
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
                className={`movie-card__btn ${fav ? 'movie-card__btn--active-rose' : ''} ${
                  heartPopping ? 'animate-heart-pop' : ''
                }`}
              >
                {ringBurst && <span className="heart-ring-burst" />}
                <Heart size={15} fill={fav ? 'currentColor' : 'none'} />
              </button>
              <button
                type="button"
                onClick={handleWl}
                aria-label={wl ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
                aria-pressed={wl}
                className={`movie-card__btn ${wl ? 'movie-card__btn--active-gold' : ''} ${
                  bookmarkBouncing ? 'animate-bookmark-bounce' : ''
                }`}
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
                  color: 'var(--color-sun)',
                  marginTop: 6,
                  fontWeight: 600,
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
    </div>
  )
}

