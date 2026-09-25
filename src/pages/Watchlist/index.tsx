import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Star, Trash2 } from 'lucide-react'
import { Layout } from '../../components/layout/Layout'
import { EmptyState } from '../../components/ui/EmptyState'
import { ImageWithFallback } from '../../components/ui/ImageWithFallback'
import { useLibrary } from '../../context/LibraryContext'
import { posterUrl } from '../../services/tmdb/images'
import { formatYear, formatRating } from '../../lib/format'

type WatchlistSortOption =
  | 'date_desc'
  | 'date_asc'
  | 'title_asc'
  | 'year_desc'
  | 'rating_desc'

const SORT_OPTIONS: { value: WatchlistSortOption; label: string }[] = [
  { value: 'date_desc',   label: 'Recently Added' },
  { value: 'date_asc',    label: 'Oldest Added' },
  { value: 'title_asc',   label: 'Title (A–Z)' },
  { value: 'year_desc',   label: 'Release Year' },
  { value: 'rating_desc', label: 'Highest Rating' },
]

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useLibrary()
  const [sortBy, setSortBy] = useState<WatchlistSortOption>('date_desc')

  const sortedWatchlist = useMemo(() => {
    const list = [...watchlist]
    switch (sortBy) {
      case 'date_desc':
        return list.sort((a, b) => b.added_at - a.added_at)
      case 'date_asc':
        return list.sort((a, b) => a.added_at - b.added_at)
      case 'title_asc':
        return list.sort((a, b) => a.title.localeCompare(b.title))
      case 'year_desc':
        return list.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''))
      case 'rating_desc':
        return list.sort((a, b) => b.vote_average - a.vote_average)
      default:
        return list
    }
  }, [watchlist, sortBy])

  return (
    <Layout title="Watchlist">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Watchlist</h1>
          <p className="page-subtitle">Movies you plan to watch later.</p>
        </div>

        {/* Glass Toolbar (Count + Sort) */}
        {watchlist.length > 0 && (
          <div
            className="glass"
            style={{
              padding: '12px 18px',
              borderRadius: 'var(--radius-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 28,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  background: 'var(--color-accent-dim)',
                  border: '1px solid rgba(242, 179, 61, 0.35)',
                  color: 'var(--color-accent)',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Bookmark size={13} fill="currentColor" />
                {watchlist.length} {watchlist.length === 1 ? 'Movie' : 'Movies'} Queued
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label
                htmlFor="watchlist-sort"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Sort:
              </label>
              <select
                id="watchlist-sort"
                className="filter-select"
                style={{ padding: '6px 12px', minWidth: 150, fontSize: 13 }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as WatchlistSortOption)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Empty State */}
        {watchlist.length === 0 ? (
          <EmptyState
            icon={<Bookmark size={48} strokeWidth={1.2} />}
            title="Your watchlist is empty"
            description="Add titles you want to watch soon, and organise your viewing queue."
            action={
              <Link
                to="/discover"
                className="btn-primary"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                Browse movies
              </Link>
            }
          />
        ) : (
          <div className="movie-grid">
            {sortedWatchlist.map((movie) => (
              <div
                key={movie.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Link
                  to={`/movie/${movie.id}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <article className="movie-card">
                    <div className="movie-card__poster poster-ratio">
                      <ImageWithFallback
                        src={posterUrl(movie.poster_path, 'w342')}
                        alt={`${movie.title} poster`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </div>
                    <div className="movie-card__info">
                      <p className="movie-card__title line-clamp-2">{movie.title}</p>
                      <div className="movie-card__meta">
                        <span className="movie-card__year">
                          {formatYear(movie.release_date)}
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--color-accent)',
                          }}
                        >
                          <Star size={11} fill="currentColor" />
                          {formatRating(movie.vote_average)}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>

                <button
                  type="button"
                  onClick={() => removeFromWatchlist(movie.id)}
                  aria-label={`Remove ${movie.title} from watchlist`}
                  className="btn-glass"
                  style={{
                    marginTop: 8,
                    width: '100%',
                    padding: '7px 10px',
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--color-danger)',
                    borderColor: 'rgba(255, 92, 122, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
