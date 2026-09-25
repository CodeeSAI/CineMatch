import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, Sparkles, Film } from 'lucide-react'
import { Layout } from '../../components/layout/Layout'
import { MovieGrid } from '../../components/movie/MovieGrid'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadMoreButton } from '../../components/ui/LoadMoreButton'
import { useDebounce } from '../../hooks/useDebounce'
import { searchMovies } from '../../services/tmdb/movies'
import type { TMDBMovie } from '../../services/tmdb/types'
import type { ApiError } from '../../types'

const DEBOUNCE_MS = 400

const POPULAR_SEARCH_SUGGESTIONS = [
  'Inception',
  'RRR',
  'Interstellar',
  'Spirited Away',
  'Dune',
  'Parasite',
  'Kantara',
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  // Input value — drives the debounced query
  const [input, setInput] = useState(initialQuery)
  const debouncedQuery = useDebounce(input.trim(), DEBOUNCE_MS)

  const [movies, setMovies] = useState<TMDBMovie[]>([])
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  // Ref to hold current AbortController so we can cancel stale requests
  const abortRef = useRef<AbortController | null>(null)

  // Sync external URL ?q= param → input (e.g. back/forward navigation)
  useEffect(() => {
    const urlQuery = searchParams.get('q') ?? ''
    if (urlQuery !== input) {
      setInput(urlQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('q')])

  // Sync debounced query → URL ?q= param
  useEffect(() => {
    const current = searchParams.get('q') ?? ''
    if (debouncedQuery !== current) {
      const next = new URLSearchParams()
      if (debouncedQuery) next.set('q', debouncedQuery)
      setSearchParams(next, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  // Main search effect — fires when debounced query changes
  useEffect(() => {
    // Abort any in-flight request
    abortRef.current?.abort()

    if (!debouncedQuery) {
      setMovies([])
      setTotalResults(null)
      setHasMore(false)
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)
    setMovies([])
    setPage(1)

    searchMovies(debouncedQuery, 1, controller.signal)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, retryKey])

  const loadMore = useCallback(() => {
    if (!debouncedQuery) return
    const nextPage = page + 1
    const controller = new AbortController()
    setLoadingMore(true)

    searchMovies(debouncedQuery, nextPage, controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return
        setMovies((prev) => [...prev, ...res.results])
        setPage(nextPage)
        setHasMore(res.page < res.total_pages)
        setLoadingMore(false)
      })
      .catch(() => setLoadingMore(false))
  }, [debouncedQuery, page])

  const hasQuery = debouncedQuery.length > 0
  const noResults = hasQuery && !loading && !error && movies.length === 0

  function handleClear() {
    setInput('')
    const next = new URLSearchParams()
    setSearchParams(next, { replace: true })
  }

  function handleSuggestionClick(term: string) {
    setInput(term)
  }

  return (
    <Layout title={debouncedQuery ? `Search: ${debouncedQuery}` : 'Search Movies'}>
      <div className="page-container" style={{ maxWidth: 1200 }}>
        <div className="page-header" style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 className="page-title">Search Movies</h1>
          <p className="page-subtitle">
            Find films across global and regional cinema in real-time.
          </p>
        </div>

        {/* Large Glass Search Bar */}
        <div style={{ maxWidth: 720, margin: '0 auto 36px' }}>
          <div
            className="glass-strong"
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-card)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px 8px 4px 18px',
              border: '1px solid var(--color-glass-border)',
              transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
            }}
          >
            <Search
              size={20}
              color="var(--color-accent)"
              style={{ flexShrink: 0, marginRight: 12 }}
              aria-hidden="true"
            />
            <input
              id="search-input"
              type="search"
              placeholder="Search by title, director, or franchise…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              autoComplete="off"
              aria-label="Search for a movie"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--color-text)',
                fontSize: 16,
                padding: '12px 0',
                fontFamily: 'var(--font-sans)',
              }}
            />
            {input && (
              <button
                type="button"
                onClick={handleClear}
                className="btn-icon"
                aria-label="Clear search input"
                style={{ width: 34, height: 34, flexShrink: 0 }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Quick Suggestions when idle */}
          {!hasQuery && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
                marginTop: 16,
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--color-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Sparkles size={13} color="var(--color-accent)" /> Popular:
              </span>
              {POPULAR_SEARCH_SUGGESTIONS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSuggestionClick(term)}
                  className="quick-chip"
                  style={{ fontSize: 12, padding: '4px 10px' }}
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Count Banner */}
        {hasQuery && totalResults !== null && !loading && (
          <p className="results-count" style={{ textAlign: 'center', marginBottom: 24 }}>
            Found {totalResults.toLocaleString()} {totalResults === 1 ? 'result' : 'results'} for &ldquo;{debouncedQuery}&rdquo;
          </p>
        )}

        {/* States */}
        {loading && <SkeletonGrid count={12} />}

        {error && !loading && (
          <ErrorState
            error={error}
            onRetry={() => {
              setError(null)
              setRetryKey((k) => k + 1)
            }}
          />
        )}

        {noResults && (
          <EmptyState
            icon={<Search size={48} strokeWidth={1.2} />}
            title={`No results for "${debouncedQuery}"`}
            description="We couldn't find any movies matching that query. Check your spelling or try another keyword."
          />
        )}

        {!hasQuery && !loading && (
          <div
            className="glass"
            style={{
              padding: '48px 24px',
              borderRadius: 'var(--radius-card)',
              textAlign: 'center',
              maxWidth: 540,
              margin: '32px auto 0',
            }}
          >
            <Film size={36} color="var(--color-accent)" style={{ margin: '0 auto 12px' }} />
            <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
              Instant Movie Search
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: 14, margin: 0 }}>
              Start typing above to search TMDB titles with instant live debouncing.
            </p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <>
            <MovieGrid movies={movies} />
            <LoadMoreButton hasMore={hasMore} loading={loadingMore} onClick={loadMore} />
          </>
        )}
      </div>
    </Layout>
  )
}
