import { useState, useEffect } from 'react'
import { Layout } from '../../components/layout/Layout'
import { HeroSection } from '../../components/movie/HeroSection'
import { MovieRow } from '../../components/movie/MovieRow'
import { SkeletonHero } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { useFetch } from '../../hooks/useFetch'
import { useLibrary } from '../../context/LibraryContext'
import { getRecommendations, type RecommendResult } from '../../lib/recommend'
import {
  getTrending,
  getPopular,
  getTopRated,
  getUpcoming,
  discoverMovies,
} from '../../services/tmdb/movies'
import type { TMDBMovie } from '../../services/tmdb/types'
import type { ApiError } from '../../types'

const INDIAN_TABS = [
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
]

export default function HomePage() {
  const { favorites, watchlist, ratings } = useLibrary()
  const [recommendations, setRecommendations] = useState<RecommendResult | null>(null)

  // Fetch recommendations whenever user library changes
  useEffect(() => {
    const controller = new AbortController()
    getRecommendations(controller.signal)
      .then((res) => {
        if (!controller.signal.aborted) {
          setRecommendations(res)
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setRecommendations(null)
        }
      })

    return () => controller.abort()
  }, [favorites.length, watchlist.length, Object.keys(ratings).length])

  // Core TMDB rows
  const trending = useFetch((signal) => getTrending('week', signal), [])
  const popular  = useFetch((signal) => getPopular(1, signal), [])
  const topRated = useFetch((signal) => getTopRated(1, signal), [])
  const upcoming = useFetch((signal) => getUpcoming(1, signal), [])

  // Tabbed Indian Cinema row state
  const [activeIndianLang, setActiveIndianLang] = useState('hi')
  const [indianMovies, setIndianMovies] = useState<TMDBMovie[] | null>(null)
  const [indianLoading, setIndianLoading] = useState(true)
  const [indianError, setIndianError] = useState<ApiError | null>(null)
  const [indianRetryKey, setIndianRetryKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setIndianLoading(true)
    setIndianError(null)

    discoverMovies(
      {
        with_original_language: activeIndianLang,
        sort_by: 'popularity.desc',
        page: 1,
      },
      controller.signal,
    )
      .then((res) => {
        if (controller.signal.aborted) return
        setIndianMovies(res.results)
        setIndianLoading(false)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setIndianError(
          err instanceof Error
            ? (err as ApiError)
            : ({ type: 'GENERIC', message: String(err) } as ApiError),
        )
        setIndianLoading(false)
      })

    return () => controller.abort()
  }, [activeIndianLang, indianRetryKey])

  return (
    <Layout title="Home">
      {/* ── Hero ──────────────────────────────────────────── */}
      {trending.loading && <SkeletonHero />}

      {trending.error && !trending.loading && (
        <div style={{ padding: '48px 24px' }}>
          <ErrorState error={trending.error} onRetry={trending.refetch} />
        </div>
      )}

      {trending.data?.results && trending.data.results.length > 0 && !trending.loading && (
        <HeroSection movies={trending.data.results} />
      )}

      {/* ── Movie rows ────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '48px 24px 0',
        }}
      >
        {/* Recommendation Row — hidden if nothing is saved */}
        {recommendations && recommendations.movies.length > 0 && (
          <MovieRow
            title={recommendations.reason}
            movies={recommendations.movies}
            loading={false}
            error={null}
          />
        )}

        {/* Tabbed Indian Cinema Row */}
        <div>
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                overflowX: 'auto',
                paddingBottom: 4,
                scrollbarWidth: 'none',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  marginRight: 4,
                  flexShrink: 0,
                }}
              >
                Indian Cinema:
              </span>
              {INDIAN_TABS.map((tab) => {
                const isActive = activeIndianLang === tab.code
                return (
                  <button
                    key={tab.code}
                    type="button"
                    onClick={() => setActiveIndianLang(tab.code)}
                    className={`quick-chip ${isActive ? 'quick-chip--active' : ''}`}
                    style={{ flexShrink: 0 }}
                  >
                    <span>{tab.label}</span>
                    <span style={{ fontSize: 11, opacity: 0.75 }}>({tab.native})</span>
                  </button>
                )
              })}
            </div>
          </div>

          <MovieRow
            title={`${INDIAN_TABS.find((t) => t.code === activeIndianLang)?.label} Cinema`}
            movies={indianMovies}
            loading={indianLoading}
            error={indianError}
            onRetry={() => setIndianRetryKey((k) => k + 1)}
            viewAllTo={`/discover?language=${activeIndianLang}&sortBy=popularity&sortDir=desc`}
          />
        </div>

        <MovieRow
          title="Trending"
          movies={trending.data?.results ?? null}
          loading={trending.loading}
          error={trending.error}
          onRetry={trending.refetch}
          viewAllTo="/discover?sortBy=popularity&sortDir=desc"
        />

        <MovieRow
          title="Popular"
          movies={popular.data?.results ?? null}
          loading={popular.loading}
          error={popular.error}
          onRetry={popular.refetch}
          viewAllTo="/discover?sortBy=popularity&sortDir=desc"
        />

        <MovieRow
          title="Top Rated"
          movies={topRated.data?.results ?? null}
          loading={topRated.loading}
          error={topRated.error}
          onRetry={topRated.refetch}
          viewAllTo="/discover?sortBy=vote_average&sortDir=desc"
        />

        <MovieRow
          title="Upcoming"
          movies={upcoming.data?.results ?? null}
          loading={upcoming.loading}
          error={upcoming.error}
          onRetry={upcoming.refetch}
          viewAllTo="/discover?sortBy=primary_release_date&sortDir=desc"
        />
      </div>
    </Layout>
  )
}
