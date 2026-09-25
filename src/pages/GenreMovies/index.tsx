import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Film, Sparkles } from 'lucide-react'
import { Layout } from '../../components/layout/Layout'
import { MovieGrid } from '../../components/movie/MovieGrid'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadMoreButton } from '../../components/ui/LoadMoreButton'
import { useGenres } from '../../context/GenresContext'
import { discoverMovies } from '../../services/tmdb/movies'
import { getGenreColor } from '../../lib/genreColors'
import type { TMDBMovie } from '../../services/tmdb/types'
import type { ApiError } from '../../types'

const SORT_OPTIONS = [
  { value: 'popularity.desc',           label: 'Most Popular' },
  { value: 'vote_average.desc',         label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Newest Releases' },
]

export default function GenreMoviesPage() {
  const { id } = useParams<{ id: string }>()
  const { getGenreName } = useGenres()

  const genreName = id ? getGenreName(Number(id)) : ''
  const pageTitle = genreName ? `${genreName} Movies` : 'Genre Movies'
  const colors = getGenreColor(genreName)

  const [movies, setMovies] = useState<TMDBMovie[]>([])
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [sortBy, setSortBy] = useState('popularity.desc')
  const [retryKey, setRetryKey] = useState(0)

  // Fetch page 1 when genre ID, sort order, or retry changes
  useEffect(() => {
    if (!id) return

    const controller = new AbortController()
    setLoading(true)
    setError(null)
    setMovies([])
    setPage(1)

    const params: Parameters<typeof discoverMovies>[0] = {
      with_genres: id,
      sort_by: sortBy,
      page: 1,
      ...(sortBy.startsWith('vote_average') && { 'vote_count.gte': 150 }),
    }

    discoverMovies(params, controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return
        setMovies(res.results)
        setTotalResults(res.total_results)
        setHasMore(res.page < res.total_pages)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(
          err instanceof Error
            ? (err as ApiError)
            : ({ type: 'GENERIC', message: String(err) } as ApiError),
        )
        setLoading(false)
      })

    return () => controller.abort()
  }, [id, sortBy, retryKey])

  // Load more pages
  const loadMore = useCallback(() => {
    if (!id) return
    const nextPage = page + 1
    const controller = new AbortController()
    setLoadingMore(true)

    const params: Parameters<typeof discoverMovies>[0] = {
      with_genres: id,
      sort_by: sortBy,
      page: nextPage,
      ...(sortBy.startsWith('vote_average') && { 'vote_count.gte': 150 }),
    }

    discoverMovies(params, controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return
        setMovies((prev) => [...prev, ...res.results])
        setPage(nextPage)
        setHasMore(res.page < res.total_pages)
        setLoadingMore(false)
      })
      .catch(() => {
        setLoadingMore(false)
      })

    return () => controller.abort()
  }, [id, page, sortBy])

  function handleRetry() {
    setError(null)
    setRetryKey((k) => k + 1)
  }

  return (
    <Layout title={pageTitle}>
      <div className="page-container">
        {/* Back breadcrumb */}
        <Link
          to="/genres"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            color: 'var(--color-muted)',
            textDecoration: 'none',
            marginBottom: 20,
            transition: 'color var(--duration-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.accent
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-muted)'
          }}
        >
          <ArrowLeft size={15} /> All Genres
        </Link>

        {/* Header Banner in Genre Tint */}
        <div
          className="glass-strong"
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-card)',
            padding: '32px 28px',
            marginBottom: 32,
            border: `1px solid ${colors.border}`,
            background: `linear-gradient(135deg, ${colors.bg} 0%, rgba(14, 16, 24, 0.88) 100%)`,
            overflow: 'hidden',
          }}
        >
          {/* Subtle ambient light */}
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              borderRadius: '50%',
              background: colors.accent,
              opacity: 0.12,
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  color: colors.accent,
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                <Sparkles size={13} />
                <span>Curated Genre</span>
              </div>
              <h1 className="page-title" style={{ color: 'var(--color-text)', margin: '0 0 6px' }}>
                {pageTitle}
              </h1>
              <p className="page-subtitle" style={{ margin: 0, maxWidth: 540 }}>
                Explore top-rated and trending titles from the {genreName ? genreName.toLowerCase() : ''} catalog.
              </p>
            </div>

            {/* Sort dropdown */}
            <div style={{ minWidth: 170 }}>
              <label
                htmlFor="genre-sort"
                className="filter-label"
                style={{ marginBottom: 6 }}
              >
                Sort By
              </label>
              <select
                id="genre-sort"
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Total results count */}
        {totalResults !== null && !loading && (
          <p className="results-count">
            {totalResults.toLocaleString()} {totalResults === 1 ? 'movie' : 'movies'} found
          </p>
        )}

        {/* Loading state */}
        {loading && <SkeletonGrid count={18} />}

        {/* Error state */}
        {error && !loading && (
          <ErrorState error={error} onRetry={handleRetry} />
        )}

        {/* Empty state */}
        {!loading && !error && movies.length === 0 && (
          <EmptyState
            icon={<Film size={48} strokeWidth={1.2} />}
            title="No movies found"
            description={`No movies found for ${genreName || 'this genre'}.`}
          />
        )}

        {/* Movies grid + Load More */}
        {!loading && !error && movies.length > 0 && (
          <>
            <MovieGrid movies={movies} />
            <LoadMoreButton
              hasMore={hasMore}
              loading={loadingMore}
              onClick={loadMore}
            />
          </>
        )}
      </div>
    </Layout>
  )
}
