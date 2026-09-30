import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Star, Bookmark, BookmarkCheck, Play, ArrowRight, ChevronLeft, ChevronRight, Flame } from 'lucide-react'
import { useLibrary } from '../../context/LibraryContext'
import { useGenres } from '../../context/GenresContext'
import { backdropUrl } from '../../services/tmdb/images'
import { formatYear, formatRating } from '../../lib/format'
import { toSavedMovie } from '../../lib/movie'
import type { TMDBMovie } from '../../services/tmdb/types'

interface Props {
  movies: TMDBMovie[]
}

export function HeroSection({ movies }: Props) {
  const items = movies.slice(0, 3)
  const [index, setIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useLibrary()
  const { getGenreName } = useGenres()

  const movie = items[index]

  // Reset imgFailed when current movie changes
  useEffect(() => {
    setImgFailed(false)
  }, [movie?.id])

  const nextSlide = useCallback(() => {
    if (items.length > 0) {
      setIndex((prev) => (prev + 1) % items.length)
    }
  }, [items.length])

  const prevSlide = useCallback(() => {
    if (items.length > 0) {
      setIndex((prev) => (prev - 1 + items.length) % items.length)
    }
  }, [items.length])

  // Rotate through top 3 trending movies every 8s
  useEffect(() => {
    if (items.length <= 1) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || isHovered) return

    const timer = setInterval(() => {
      nextSlide()
    }, 8000)

    return () => clearInterval(timer)
  }, [items.length, isHovered, nextSlide])

  if (!movie) return null

  const inWl = isInWatchlist(movie.id)
  const backdrop = backdropUrl(movie.backdrop_path, 'w1280') || backdropUrl(movie.backdrop_path, 'w780')
  const year = formatYear(movie.release_date)
  const rating = formatRating(movie.vote_average)
  const genreNames = (movie.genre_ids || [])
    .slice(0, 3)
    .map(getGenreName)
    .filter(Boolean)

  function handleWatchlistToggle() {
    inWl ? removeFromWatchlist(movie.id) : addToWatchlist(toSavedMovie(movie))
  }

  return (
    <div
      className={`hero-container ${isHovered ? 'hero-paused' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="hero-cinematic">
        {/* Full-bleed Backdrop with Subtle Ken Burns Zoom */}
        {backdrop && !imgFailed ? (
          <img
            key={movie.id}
            src={backdrop}
            alt=""
            aria-hidden="true"
            loading="eager"
            onError={() => setImgFailed(true)}
            className="hero-ken-burns hero-cinematic__img"
          />
        ) : (
          <div className="hero-cinematic__fallback" />
        )}

        {/* Multi-stop Cinematic Gradient Scrim + Ambient Blue/Crimson Light */}
        <div className="hero-cinematic__scrim-v" aria-hidden="true" />
        <div className="hero-cinematic__scrim-h" aria-hidden="true" />
        <div className="hero-cinematic__ambient-light" aria-hidden="true" />

        {/* Slide Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous trending movie"
              className="hero-nav-arrow hero-nav-arrow--left"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next trending movie"
              className="hero-nav-arrow hero-nav-arrow--right"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Content sitting seamlessly over the cinematic artwork */}
        <div className="hero-cinematic__content" key={movie.id}>
          {/* Eyebrow Label */}
          <div className="hero-stagger-1 hero-eyebrow-badge">
            <Flame size={12} color="#EF4444" fill="#EF4444" />
            <span>TRENDING #{index + 1}</span>
          </div>

          {/* Large Dominant Display Title */}
          <h1 className="hero-stagger-2 hero-cinematic__title">
            {movie.title}
          </h1>

          {/* Metadata Row: Rating, Year, Genres */}
          <div className="hero-stagger-3 hero-cinematic__meta">
            <span className="hero-rating-badge">
              <Star size={12} fill="#F59E0B" color="#F59E0B" />
              <span>{rating}</span>
            </span>

            <span className="hero-meta-dot">•</span>
            <span className="hero-meta-year">{year}</span>

            {genreNames.map((name) => (
              <span key={name} className="hero-genre-pill">
                {name}
              </span>
            ))}
          </div>

          {/* Description / Overview */}
          {movie.overview && (
            <p className="hero-stagger-4 hero-cinematic__overview line-clamp-3">
              {movie.overview}
            </p>
          )}

          {/* Hero Action Buttons */}
          <div className="hero-stagger-5 hero-cinematic__actions">
            <Link to={`/movie/${movie.id}`} className="hero-btn-primary">
              <Play size={16} fill="currentColor" />
              <span>Watch Now</span>
              <ArrowRight size={15} style={{ marginLeft: 2 }} />
            </Link>

            <button
              type="button"
              onClick={handleWatchlistToggle}
              aria-pressed={inWl}
              className={`hero-btn-secondary ${inWl ? 'hero-btn-secondary--active' : ''}`}
            >
              {inWl ? (
                <>
                  <BookmarkCheck size={16} color="var(--color-blue)" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Bookmark size={16} />
                  <span>Add to Watchlist</span>
                </>
              )}
            </button>
          </div>

          {/* Auto-rotation Progress Indicators */}
          {items.length > 1 && (
            <div className="hero-cinematic__progress">
              {items.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}: ${m.title}`}
                  aria-current={i === index ? 'true' : 'false'}
                  className={`hero-progress-track ${i === index ? 'active hero-dot-active' : ''}`}
                >
                  {i === index && <span key={`progress-${index}`} className="hero-dot-progress-bar" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
