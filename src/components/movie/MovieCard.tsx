import { useState, type MouseEvent as ReactMouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Bookmark, Star, Play, Sparkles } from 'lucide-react'
import { ImageWithFallback } from '../ui/ImageWithFallback'
import { useLibrary } from '../../context/LibraryContext'
import { useGenres } from '../../context/GenresContext'
import { useInView } from '../../hooks/useInView'
import { posterUrl } from '../../services/tmdb/images'
import { formatYear, formatRating } from '../../lib/format'
import { toSavedMovie } from '../../lib/movie'
import type { TMDBMovie } from '../../services/tmdb/types'

interface Props {
  movie: TMDBMovie
  reason?: string
  index?: number
  rank?: number
}

export function MovieCard({ movie, reason, index = 0, rank }: Props) {
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
  const year = formatYear(movie.release_date)
  const rating = formatRating(movie.vote_average)
  const poster = posterUrl(movie.poster_path, 'w500') || posterUrl(movie.poster_path, 'w342')

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
        <article className="stream-card">
          {/* ── 2:3 Cinematic Poster Media Container ── */}
          <div className="stream-card__media poster-ratio">
            <ImageWithFallback
              src={poster}
              alt={`${movie.title} poster`}
              className="stream-card__img"
            />

            {/* Top-Left: Glass Rating Badge */}
            <div className="stream-card__rating" aria-label={`Rating: ${rating} out of 10`}>
              <Star size={11} fill="currentColor" strokeWidth={0} />
              <span>{rating}</span>
            </div>

            {/* Optional Top Rank Badge (e.g. for Top Rated row) */}
            {typeof rank === 'number' && (
              <div className="stream-card__rank" aria-label={`Rank #${rank}`}>
                #{rank}
              </div>
            )}

            {/* Hover Scrim Overlay */}
            <div className="stream-card__scrim" aria-hidden="true" />

            {/* Centered Quick Action Play Button */}
            <div className="stream-card__play-wrap" aria-hidden="true">
              <span className="stream-card__play-btn">
                <Play size={18} fill="currentColor" style={{ marginLeft: 2 }} />
              </span>
            </div>

            {/* Top-Right: Quick Action Buttons (Favorite & Watchlist) */}
            <div className="stream-card__actions">
              <button
                type="button"
                onClick={handleFav}
                aria-label={fav ? `Remove ${movie.title} from favourites` : `Add ${movie.title} to favourites`}
                aria-pressed={fav}
                className={`stream-card__btn ${fav ? 'stream-card__btn--active-rose' : ''} ${
                  heartPopping ? 'animate-heart-pop' : ''
                }`}
              >
                {ringBurst && <span className="heart-ring-burst" />}
                <Heart size={14} fill={fav ? 'currentColor' : 'none'} />
              </button>
              <button
                type="button"
                onClick={handleWl}
                aria-label={wl ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
                aria-pressed={wl}
                className={`stream-card__btn ${wl ? 'stream-card__btn--active-blue' : ''} ${
                  bookmarkBouncing ? 'animate-bookmark-bounce' : ''
                }`}
              >
                <Bookmark size={14} fill={wl ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* ── Movie Information Strip ── */}
          <div className="stream-card__info">
            <h3 className="stream-card__title" title={movie.title}>
              {movie.title}
            </h3>

            <div className="stream-card__meta">
              <span>{year}</span>
              {firstGenre && (
                <>
                  <span className="stream-card__dot">•</span>
                  <span className="stream-card__genre">{firstGenre}</span>
                </>
              )}
            </div>

            {/* Subtle contextual recommendation indicator */}
            {reason && (
              <div className="stream-card__reason" title={reason}>
                <Sparkles size={11} color="var(--color-blue)" style={{ flexShrink: 0 }} />
                <span>{reason}</span>
              </div>
            )}
          </div>
        </article>
      </Link>
    </div>
  )
}
