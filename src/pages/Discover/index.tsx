import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { MovieGrid } from '../../components/movie/MovieGrid'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadMoreButton } from '../../components/ui/LoadMoreButton'
import {
  FilterPanel,
  paramsToFilters,
  filtersToParams,
  countActiveFilters,
  EMPTY_FILTERS,
} from './FilterPanel'
import type { FilterState } from './FilterPanel'
import { discoverMovies } from '../../services/tmdb/movies'
import { useGenres } from '../../context/GenresContext'
import { INDIAN_LANGUAGES, getLanguageName } from '../../lib/languages'
import { Film, SlidersHorizontal, X } from 'lucide-react'
import type { TMDBMovie } from '../../services/tmdb/types'
import type { ApiError } from '../../types'

/** Build TMDB discover params from FilterState */
function buildDiscoverParams(f: FilterState, page: number) {
  const sortField = f.sortBy || 'popularity'
  const sortDir = f.sortDir || 'desc'
  const hasLanguage = Boolean(f.language)

  return {
    page,
    sort_by: `${sortField}.${sortDir}`,
    ...(f.genre && { with_genres: f.genre }),
    ...(f.year && { primary_release_year: Number(f.year) }),
    ...(f.ratingMin && { 'vote_average.gte': Number(f.ratingMin) }),
    ...(f.ratingMax && { 'vote_average.lte': Number(f.ratingMax) }),
    ...(f.language && { with_original_language: f.language }),
    ...(f.runtimeMin && { 'with_runtime.gte': Number(f.runtimeMin) }),
    ...(f.runtimeMax && { 'with_runtime.lte': Number(f.runtimeMax) }),
    // When sorting by rating, lower the threshold to 25 for regional/specific languages so they aren't hidden
    ...(sortField === 'vote_average' && { 'vote_count.gte': hasLanguage ? 25 : 200 }),
  }
}

export default function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { genres } = useGenres()
  const filters = useMemo(() => paramsToFilters(searchParams), [searchParams])

  const [movies, setMovies] = useState<TMDBMovie[]>([])
  const [page, setPage] = useState(1)
  const [totalResults, setTotal] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const activeCount = countActiveFilters(filters)

  // Fetch page 1 whenever filters change
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    setMovies([])
    setPage(1)

    discoverMovies(buildDiscoverParams(filters, 1), controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return
        setMovies(res.results)
        setTotal(res.total_results)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), retryKey])

  // Load more — appends to existing list
  const loadMore = useCallback(() => {
    const nextPage = page + 1
    const controller = new AbortController()
    setLoadingMore(true)

    discoverMovies(buildDiscoverParams(filters, nextPage), controller.signal)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchParams.toString()])

  function handleApply(newFilters: FilterState) {
    setSearchParams(filtersToParams(newFilters))
  }

  function handleRetry() {
    setError(null)
    setRetryKey((k) => k + 1)
  }

  // Quick Indian language chip handler
  function handleQuickLanguage(code: string) {
    const next = { ...filters }
    if (next.language === code) {
      next.language = '' // toggle off
    } else {
      next.language = code
    }
    setSearchParams(filtersToParams(next))
  }

  // Remove individual filter chip
  function removeFilter<K extends keyof FilterState>(key: K, defaultValue: FilterState[K] = '' as FilterState[K]) {
    const next = { ...filters, [key]: defaultValue }
    setSearchParams(filtersToParams(next))
  }

  function handleClearAll() {
    setSearchParams(filtersToParams(EMPTY_FILTERS))
  }

  // Find genre name for active chip
  const activeGenreName = filters.genre
    ? genres.find((g) => String(g.id) === filters.genre)?.name ?? `Genre #${filters.genre}`
    : null

  return (
    <Layout title="Discover">
      <div className="page-container">
        {/* Page Header with mobile filter toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <h1 className="page-title">Discover Movies</h1>
            <p className="page-subtitle">
              Explore cinema across Indian & world industries, genres, ratings, and eras.
            </p>
          </div>

          {/* Mobile drawer button — visible on < 1024px */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="btn-glass"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
              }}
            >
              <SlidersHorizontal size={16} color="var(--color-accent)" />
              <span>Filters</span>
              {activeCount > 0 && (
                <span
                  style={{
                    background: 'var(--color-accent)',
                    color: '#1A1204',
                    fontSize: 11,
                    fontWeight: 700,
                    borderRadius: 'var(--radius-pill)',
                    padding: '2px 7px',
                    lineHeight: 1.2,
                  }}
                >
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Indian Languages Quick Chips Bar */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
              }}
            >
              Indian Cinema Quick Filters
            </span>
          </div>

          <div className="quick-chips-row" role="group" aria-label="Indian languages">
            <button
              type="button"
              onClick={() => handleQuickLanguage('')}
              className={`quick-chip ${!filters.language ? 'quick-chip--active' : ''}`}
            >
              All
            </button>
            {INDIAN_LANGUAGES.map((lang) => {
              const isActive = filters.language === lang.code
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleQuickLanguage(lang.code)}
                  className={`quick-chip ${isActive ? 'quick-chip--active' : ''}`}
                  title={`${lang.name} (${lang.nativeName})`}
                >
                  <span>{lang.name}</span>
                  <span style={{ fontSize: 11, opacity: 0.75 }}>({lang.nativeName})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main 2-column layout */}
        <div className="discover-layout">
          {/* Desktop Sticky Sidebar */}
          <aside className="discover-sidebar hidden lg:block">
            <FilterPanel onApply={handleApply} />
          </aside>

          {/* Content Area */}
          <main className="discover-content">
            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="active-filters-wrap" aria-label="Active filters">
                <span style={{ fontSize: 12, color: 'var(--color-muted)', marginRight: 4 }}>
                  Active filters:
                </span>

                {activeGenreName && (
                  <span className="active-filter-pill">
                    Genre: {activeGenreName}
                    <button
                      type="button"
                      onClick={() => removeFilter('genre')}
                      aria-label="Remove genre filter"
                    >
                      <X size={13} />
                    </button>
                  </span>
                )}

                {filters.year && (
                  <span className="active-filter-pill">
                    Year: {filters.year}
                    <button
                      type="button"
                      onClick={() => removeFilter('year')}
                      aria-label="Remove year filter"
                    >
                      <X size={13} />
                    </button>
                  </span>
                )}

                {(filters.ratingMin || filters.ratingMax) && (
                  <span className="active-filter-pill">
                    Rating: {filters.ratingMin || '0'} – {filters.ratingMax || '10'}
                    <button
                      type="button"
                      onClick={() => {
                        removeFilter('ratingMin')
                        removeFilter('ratingMax')
                      }}
                      aria-label="Remove rating filter"
                    >
                      <X size={13} />
                    </button>
                  </span>
                )}

                {filters.language && (
                  <span className="active-filter-pill">
                    Language: {getLanguageName(filters.language)}
                    <button
                      type="button"
                      onClick={() => removeFilter('language')}
                      aria-label="Remove language filter"
                    >
                      <X size={13} />
                    </button>
                  </span>
                )}

                {(filters.runtimeMin || filters.runtimeMax) && (
                  <span className="active-filter-pill">
                    Runtime: {filters.runtimeMin || '0'} – {filters.runtimeMax || '∞'}m
                    <button
                      type="button"
                      onClick={() => {
                        removeFilter('runtimeMin')
                        removeFilter('runtimeMax')
                      }}
                      aria-label="Remove runtime filter"
                    >
                      <X size={13} />
                    </button>
                  </span>
                )}

                {(filters.sortBy !== 'popularity' || filters.sortDir !== 'desc') && (
                  <span className="active-filter-pill">
                    Sorted by {filters.sortBy} ({filters.sortDir})
                    <button
                      type="button"
                      onClick={() => {
                        removeFilter('sortBy', 'popularity')
                        removeFilter('sortDir', 'desc')
                      }}
                      aria-label="Reset sort order"
                    >
                      <X size={13} />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleClearAll}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-muted)',
                    fontSize: 12,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: '4px 6px',
                  }}
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results count */}
            {totalResults !== null && !loading && (
              <p className="results-count">
                {totalResults.toLocaleString()} {totalResults === 1 ? 'movie' : 'movies'} found
                {filters.language ? ` in ${getLanguageName(filters.language)}` : ''}
              </p>
            )}

            {/* Loading skeletons */}
            {loading && <SkeletonGrid count={18} />}

            {/* Error state */}
            {error && !loading && <ErrorState error={error} onRetry={handleRetry} />}

            {/* Empty state */}
            {!loading && !error && movies.length === 0 && (
              <EmptyState
                icon={<Film size={48} strokeWidth={1.2} />}
                title="No movies found"
                description={
                  filters.language
                    ? `No films matched your filters for ${getLanguageName(filters.language)}. Try relaxing your rating or year criteria.`
                    : 'Try adjusting or clearing your filters.'
                }
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
          </main>
        </div>

        {/* Mobile Slide-Over Glass Drawer */}
        {mobileDrawerOpen && (
          <>
            <div
              className="drawer-backdrop"
              onClick={() => setMobileDrawerOpen(false)}
              aria-hidden="true"
            />
            <div className="drawer-content" role="dialog" aria-modal="true" aria-label="Filters">
              <FilterPanel
                onApply={handleApply}
                isMobileDrawer={true}
                onCloseMobile={() => setMobileDrawerOpen(false)}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
