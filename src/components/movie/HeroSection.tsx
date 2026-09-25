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
      className="hero"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 560,
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        background: '#07080D',
      }}
    >
      {/* Full-bleed Backdrop Image */}
      {backdrop ? (
        <img
          key={movie.id}
          src={backdrop}
          alt=""
          aria-hidden="true"
          loading="eager"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: 0.42,
            transition: 'opacity 350ms ease-in-out',
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #0E1018 0%, #07080D 100%)',
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
            'linear-gradient(to bottom, rgba(7, 8, 13, 0.15) 0%, rgba(7, 8, 13, 0.45) 45%, rgba(7, 8, 13, 0.88) 80%, #07080D 100%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(7, 8, 13, 0.75) 0%, rgba(7, 8, 13, 0.25) 60%, transparent 100%)',
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

      {/* Hero Content & Frosted Glass Info Panel */}
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
          className="glass-strong"
          style={{
            maxWidth: 620,
            borderRadius: 20,
            padding: '32px 32px 28px',
            background: 'rgba(14, 16, 24, 0.84)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow:
              '0 20px 48px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.16)',
          }}
        >
          {/* Eyebrow Label */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-accent-dim)',
              color: 'var(--color-accent)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            Trending #{index + 1}
          </div>

          {/* Fraunces Title */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4.5vw, 42px)',
              fontWeight: 600,
              lineHeight: 1.15,
              color: 'var(--color-text)',
              marginBottom: 12,
            }}
          >
            {movie.title}
          </h1>

          {/* Meta: Rating, Year, Genre pills */}
          <div
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
                fontWeight: 700,
                color: 'var(--color-accent)',
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
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  fontSize: 11,
                  color: 'var(--color-muted)',
                }}
              >
                {name}
              </span>
            ))}
          </div>

          {/* Clamped Overview */}
          {movie.overview && (
            <p
              className="line-clamp-3"
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: 'rgba(244, 242, 237, 0.85)',
                marginBottom: 24,
              }}
            >
              {movie.overview}
            </p>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link to={`/movie/${movie.id}`} className="btn-primary">
              View details
              <ArrowRight size={15} />
            </Link>

            <button
              type="button"
              onClick={handleWatchlistToggle}
              aria-pressed={inWl}
              className="btn-glass"
              style={{
                color: inWl ? 'var(--color-accent)' : 'var(--color-text)',
                borderColor: inWl ? 'rgba(242, 179, 61, 0.4)' : undefined,
                background: inWl ? 'rgba(242, 179, 61, 0.12)' : undefined,
              }}
            >
              {inWl ? (
                <>
                  <BookmarkCheck size={16} color="var(--color-accent)" />
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

          {/* Slide Indicator Dots */}
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
                  style={{
                    width: i === index ? 24 : 8,
                    height: 8,
                    borderRadius: 'var(--radius-pill)',
                    background:
                      i === index ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all var(--duration-fast) ease',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
