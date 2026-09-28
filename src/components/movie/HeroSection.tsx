import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Star, Bookmark, BookmarkCheck, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
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

  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useLibrary()
  const { getGenreName } = useGenres()

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
  // Pause on hover; no auto-rotate if prefers-reduced-motion
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

  const movie = items[index]
  if (!movie) return null

  const inWl = isInWatchlist(movie.id)
  const backdrop = backdropUrl(movie.backdrop_path, 'w1280')
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
      className={`hero ${isHovered ? 'hero-paused' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 560,
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        background: '#0B0714',
      }}
    >
      {/* Full-bleed Backdrop Image with Slow Ken Burns Zoom */}
      {backdrop ? (
        <img
          key={movie.id}
          src={backdrop}
          alt=""
          aria-hidden="true"
          loading="eager"
          className="hero-ken-burns"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: 0.45,
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #150E24 0%, #0B0714 100%)',
          }}
        />
      )}

      {/* Multi-stop ambient fade into page background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(11, 7, 20, 0.15) 0%, rgba(11, 7, 20, 0.45) 45%, rgba(11, 7, 20, 0.88) 80%, #0B0714 100%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(11, 7, 20, 0.85) 0%, rgba(11, 7, 20, 0.35) 60%, transparent 100%)',
        }}
      />

      {/* Slide Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous trending movie"
            className="scroll-arrow"
            style={{ left: 24, top: '50%' }}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next trending movie"
            className="scroll-arrow"
            style={{ right: 24, top: '50%' }}
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Hero Content & Frosted Glass Info Panel with Animated Glow Border */}
      <div
        className="page-container"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          paddingBottom: 48,
          paddingTop: 32,
        }}
      >
        <div
          className="hero-panel-glow"
          style={{
            maxWidth: 620,
            padding: '32px 32px 28px',
          }}
        >
          {/* Keyed container forces staggered entrance on slide change */}
          <div key={movie.id}>
            {/* Eyebrow Label (Stagger 1) */}
            <div
              className="hero-stagger-1"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(255, 59, 92, 0.16)',
                border: '1px solid rgba(255, 59, 92, 0.32)',
                color: 'var(--color-crimson)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              Trending #{index + 1}
            </div>

            {/* Fraunces Title with Gradient Text (Stagger 2) */}
            <h1
              className="hero-stagger-2"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 4.5vw, 42px)',
                fontWeight: 600,
                lineHeight: 1.15,
                color: 'var(--color-text)',
                marginBottom: 12,
              }}
            >
              <span className="gradient-text">{movie.title}</span>
            </h1>

            {/* Meta: Rating, Year, Genre pills (Stagger 3) */}
            <div
              className="hero-stagger-3"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
                marginBottom: 14,
                fontSize: 13,
                color: 'var(--color-muted)',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontWeight: 800,
                  color: 'var(--color-sun)',
                }}
              >
                <Star size={13} fill="currentColor" />
                {rating}
              </span>

              <span>•</span>
              <span>{year}</span>

              {genreNames.map((name) => (
                <span
                  key={name}
                  style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    fontSize: 11,
                    color: 'var(--color-text)',
                  }}
                >
                  {name}
                </span>
              ))}
            </div>

            {/* Clamped Overview (Stagger 4) */}
            {movie.overview && (
              <p
                className="line-clamp-3 hero-stagger-4"
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: 'rgba(247, 243, 255, 0.85)',
                  marginBottom: 24,
                }}
              >
                {movie.overview}
              </p>
            )}

            {/* Action Buttons (Stagger 5) */}
            <div
              className="hero-stagger-5"
              style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
            >
              <Link to={`/movie/${movie.id}`} className="btn-primary">
                View details
                <ArrowRight size={15} />
              </Link>

              <button
                type="button"
                onClick={handleWatchlistToggle}
                aria-pressed={inWl}
                className="btn-outline"
                style={{
                  color: inWl ? 'var(--color-sun)' : 'var(--color-text)',
                }}
              >
                {inWl ? (
                  <>
                    <BookmarkCheck size={16} color="var(--color-sun)" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Bookmark size={16} />
                    Add to Watchlist
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Slide Indicator Dots with Time Progress Fill */}
          {items.length > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 24,
                paddingTop: 16,
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {items.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}: ${m.title}`}
                  aria-current={i === index ? 'true' : 'false'}
                  className={i === index ? 'hero-dot-active' : ''}
                  style={{
                    position: 'relative',
                    width: i === index ? 32 : 8,
                    height: 8,
                    borderRadius: 'var(--radius-pill)',
                    background: 'rgba(255, 255, 255, 0.20)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    overflow: 'hidden',
                    transition: 'width var(--duration-fast) ease',
                  }}
                >
                  {i === index && (
                    <span
                      key={`progress-${index}`}
                      className="hero-dot-progress-bar"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

