import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MovieCard } from './MovieCard'
import { SkeletonRow } from '../ui/Skeleton'
import { ErrorState } from '../ui/ErrorState'
import type { TMDBMovie } from '../../services/tmdb/types'
import type { ApiError } from '../../types'

interface Props {
  title: string
  movies: (TMDBMovie & { reason?: string })[] | null
  loading: boolean
  error: ApiError | null
  onRetry?: () => void
  viewAllTo?: string
  variant?: 'default' | 'gradient' | 'cream'
}

export function MovieRow({
  title,
  movies,
  loading,
  error,
  onRetry,
  viewAllTo,
  variant = 'default',
}: Props) {
  const rowRef = useRef<HTMLDivElement>(null)

  function scroll(offset: number) {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: offset, behavior: 'smooth' })
    }
  }

  const bandClass =
    variant === 'gradient'
      ? 'row-band--gradient'
      : variant === 'cream'
      ? 'row-band--cream'
      : ''

  return (
    <section
      aria-label={title}
      className={bandClass}
      style={{
        marginBottom: variant === 'default' ? 48 : 0,
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        className="movie-row__header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 600,
            color: variant === 'cream' ? 'var(--color-ink)' : 'var(--color-text)',
            letterSpacing: '-0.01em',
          }}
        >
          {variant === 'gradient' ? (
            <span className="gradient-text">{title}</span>
          ) : (
            title
          )}
        </h2>
        {viewAllTo && (
          <Link
            to={viewAllTo}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: variant === 'cream' ? '#C81D3D' : 'var(--color-crimson)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              transition: 'opacity var(--duration-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            View all →
          </Link>
        )}
      </div>

      {loading && <SkeletonRow count={8} />}

      {error && !loading && (
        <ErrorState error={error} onRetry={onRetry} compact />
      )}

      {!loading && !error && movies && movies.length > 0 && (
        <div className="scroll-row-wrapper" style={{ position: 'relative' }}>
          {/* Desktop Left Scroll Arrow */}
          <button
            type="button"
            onClick={() => scroll(-540)}
            className="scroll-arrow scroll-arrow--left"
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Desktop Right Scroll Arrow */}
          <button
            type="button"
            onClick={() => scroll(540)}
            className="scroll-arrow scroll-arrow--right"
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight size={20} />
          </button>

          {/* Horizontal Scroll Strip with Scroll-Snap */}
          <div ref={rowRef} className="scroll-row">
            {movies.map((movie, idx) => (
              <div key={movie.id} className="movie-row__card">
                <MovieCard movie={movie} reason={movie.reason} index={idx} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

