import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star,
  Heart,
  Bookmark,
  Play,
  ArrowLeft,
  Clock,
  Calendar,
  Globe,
  Film,
  X,
} from 'lucide-react'
import { Layout } from '../../components/layout/Layout'
import { MovieRow } from '../../components/movie/MovieRow'
import { GenreTag } from '../../components/ui/GenreTag'
import { ImageWithFallback } from '../../components/ui/ImageWithFallback'
import { ErrorState } from '../../components/ui/ErrorState'
import { SkeletonHero } from '../../components/ui/Skeleton'
import { useLibrary } from '../../context/LibraryContext'
import { getMovieDetails } from '../../services/tmdb/movies'
import { posterUrl, backdropUrl, profileUrl } from '../../services/tmdb/images'
import { formatRuntime, formatDate, formatRating, formatCount } from '../../lib/format'
import { detailToSavedMovie } from '../../lib/movie'
import { getLanguageName } from '../../lib/languages'
import type { TMDBMovieDetail } from '../../services/tmdb/types'
import type { StarRating, ApiError } from '../../types'

const STAR_VALUES: StarRating[] = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const movieId = Number(id)

  const {
    isFavorite,
    addFavorite,
    removeFavorite,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    getRating,
    setRating,
    recordView,
  } = useLibrary()

  const [movie, setMovie] = useState<TMDBMovieDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [playTrailer, setPlayTrailer] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  // Fetch full details with credits, videos, similar, recommendations
  useEffect(() => {
    if (!movieId) return
    const controller = new AbortController()

    setLoading(true)
    setError(null)
    setPlayTrailer(false)

    getMovieDetails(movieId, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setMovie(data)
        recordView(detailToSavedMovie(data))
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
  }, [movieId, retryKey, recordView])

  const fav = isFavorite(movieId)
  const wl = isInWatchlist(movieId)
  const userRating = getRating(movieId)

  // Find official trailer or best teaser
  const trailer =
    movie?.videos?.results?.find(
      (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official,
    ) ??
    movie?.videos?.results?.find(
      (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'),
    ) ??
    movie?.videos?.results?.find((v) => v.site === 'YouTube')

  // Find Director
  const director = movie?.credits?.crew?.find((c) => c.job === 'Director')

  // Top 12 cast members
  const cast = movie?.credits?.cast?.slice(0, 12) ?? []

  function handleRatingClick(val: StarRating) {
    if (userRating === val) {
      setRating(movieId, 0) // toggle off to clear
    } else {
      setRating(movieId, val)
    }
  }

  function handleFavToggle() {
    if (!movie) return
    const saved = detailToSavedMovie(movie)
    fav ? removeFavorite(movie.id) : addFavorite(saved)
  }

  function handleWlToggle() {
    if (!movie) return
    const saved = detailToSavedMovie(movie)
    wl ? removeFromWatchlist(movie.id) : addToWatchlist(saved)
  }

  if (loading) {
    return (
      <Layout title="Movie">
        <SkeletonHero />
      </Layout>
    )
  }

  if (error || !movie) {
    return (
      <Layout title="Movie">
        <div style={{ padding: '80px 24px', maxWidth: 600, margin: '0 auto' }}>
          <ErrorState
            error={error ?? ({ type: 'GENERIC', message: 'Movie not found' } as ApiError)}
            onRetry={() => {
              setError(null)
              setRetryKey((k) => k + 1)
            }}
          />
        </div>
      </Layout>
    )
  }

  const backdrop = backdropUrl(movie.backdrop_path, 'w1280')
  const poster = posterUrl(movie.poster_path, 'w500')
  const languageName = getLanguageName(movie.original_language)

  return (
    <Layout title={movie.title}>
      {/* ── Full-Bleed Backdrop & Hero Section ────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '68vh',
          background: '#07080D',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {/* Full-bleed Backdrop Image */}
        {backdrop && (
          <img
            src={backdrop}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 20%',
              opacity: 0.32,
            }}
          />
        )}

        {/* Cinematic dark gradients fading seamlessly into page background */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(7, 8, 13, 0.35) 0%, rgba(7, 8, 13, 0.7) 50%, #07080D 100%)',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(109, 124, 255, 0.12), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content Container */}
        <div
          className="page-container"
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            paddingTop: 36,
            paddingBottom: 40,
          }}
        >
          {/* Back link */}
          <Link
            to="/discover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--color-muted)',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
              marginBottom: 28,
              transition: 'color var(--duration-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-muted)'
            }}
          >
            <ArrowLeft size={15} /> Back to Movies
          </Link>

          <div
            style={{
              display: 'flex',
              gap: 36,
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            {/* Poster with deep shadow */}
            <div
              style={{
                width: 250,
                maxWidth: '100%',
                flexShrink: 0,
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                border: '1px solid var(--color-glass-border)',
                boxShadow:
                  '0 24px 48px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
            >
              <ImageWithFallback
                src={poster}
                alt={`${movie.title} poster`}
                style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Glass info panel */}
            <div
              className="glass"
              style={{
                flex: 1,
                minWidth: 280,
                padding: '28px 30px',
                borderRadius: 'var(--radius-card)',
              }}
            >
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  fontWeight: 600,
                  lineHeight: 1.15,
                  color: 'var(--color-text)',
                  marginBottom: 8,
                }}
              >
                {movie.title}
              </h1>

              {movie.tagline && (
                <p
                  style={{
                    fontSize: 16,
                    fontStyle: 'italic',
                    color: 'var(--color-accent)',
                    marginBottom: 18,
                  }}
                >
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}

              {/* Glass Stat Chips Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flexWrap: 'wrap',
                  marginBottom: 20,
                }}
              >
                {/* Rating Chip */}
                <div
                  className="glass"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--color-accent)',
                  }}
                >
                  <Star size={14} fill="currentColor" />
                  <span>{formatRating(movie.vote_average)}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 400 }}>
                    ({formatCount(movie.vote_count)})
                  </span>
                </div>

                {/* Release Year */}
                <div
                  className="glass"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: 13,
                    color: 'var(--color-text)',
                  }}
                >
                  <Calendar size={13} color="var(--color-muted)" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>

                {/* Runtime */}
                <div
                  className="glass"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: 13,
                    color: 'var(--color-text)',
                  }}
                >
                  <Clock size={13} color="var(--color-muted)" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>

                {/* Language */}
                <div
                  className="glass"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: 13,
                    color: 'var(--color-text)',
                  }}
                >
                  <Globe size={13} color="var(--color-muted)" />
                  <span>{languageName}</span>
                </div>

                {director && (
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--color-muted)',
                      padding: '4px 6px',
                    }}
                  >
                    Directed by <strong style={{ color: 'var(--color-text)' }}>{director.name}</strong>
                  </div>
                )}
              </div>

              {/* Genre tags */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {movie.genres.map((g) => (
                  <Link key={g.id} to={`/genres/${g.id}`} style={{ textDecoration: 'none' }}>
                    <GenreTag label={g.name} />
                  </Link>
                ))}
              </div>

              {/* Overview */}
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: 'rgba(244, 242, 237, 0.88)',
                  maxWidth: 720,
                  marginBottom: 24,
                }}
              >
                {movie.overview}
              </p>

              {/* Action Buttons: Favorites, Watchlist & Rating */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  flexWrap: 'wrap',
                  marginBottom: 24,
                }}
              >
                <button
                  type="button"
                  onClick={handleFavToggle}
                  className={fav ? 'btn-primary' : 'btn-glass'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    borderColor: fav ? 'transparent' : 'rgba(255, 92, 122, 0.35)',
                    color: fav ? '#1A1204' : 'var(--color-rose)',
                  }}
                >
                  <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
                  {fav ? 'In Favourites' : 'Add to Favourites'}
                </button>

                <button
                  type="button"
                  onClick={handleWlToggle}
                  className={wl ? 'btn-primary' : 'btn-glass'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    color: wl ? '#1A1204' : 'var(--color-accent)',
                    borderColor: wl ? 'transparent' : 'rgba(242, 179, 61, 0.35)',
                  }}
                >
                  <Bookmark size={16} fill={wl ? 'currentColor' : 'none'} />
                  {wl ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
              </div>

              {/* Gold 5-Star Rating Card */}
              <div
                className="card-surface"
                style={{
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-card)',
                  maxWidth: 520,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
                    Your Personal Rating:
                  </span>
                  {userRating > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--color-accent)', fontWeight: 700 }}>
                        ★ {userRating} / 5
                      </span>
                      <button
                        type="button"
                        onClick={() => setRating(movieId, 0)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: 2,
                        }}
                        aria-label="Clear rating"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                      Click a score to rate
                    </span>
                  )}
                </div>

                {/* Rating buttons (half stars in gold) */}
                <div
                  role="radiogroup"
                  aria-label="Personal movie rating"
                  style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}
                >
                  {STAR_VALUES.map((val) => {
                    const active = userRating >= val
                    return (
                      <button
                        key={val}
                        type="button"
                        role="radio"
                        aria-checked={userRating === val}
                        aria-label={`${val} stars`}
                        onClick={() => handleRatingClick(val)}
                        style={{
                          background: active ? 'var(--color-accent)' : 'rgba(255,255,255,0.06)',
                          color: active ? '#1A1204' : 'var(--color-text)',
                          border: `1px solid ${
                            active ? 'var(--color-accent)' : 'var(--color-border)'
                          }`,
                          borderRadius: 6,
                          padding: '5px 8px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all var(--duration-fast)',
                        }}
                      >
                        ★ {val}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Official Trailer in Glass Frame ───────────────────────────────── */}
      <section className="page-container" style={{ paddingTop: 36, paddingBottom: 24 }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 600,
            marginBottom: 18,
            color: 'var(--color-text)',
          }}
        >
          Official Trailer
        </h2>

        {trailer ? (
          <div
            className="glass-strong"
            style={{
              padding: 12,
              borderRadius: 'var(--radius-card)',
              maxWidth: 820,
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: 10,
                overflow: 'hidden',
                background: '#000',
              }}
            >
              {playTrailer ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1`}
                  title={trailer.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlayTrailer(true)}
                  aria-label={`Play trailer: ${trailer.name}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'block',
                  }}
                >
                  <img
                    src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(7, 8, 13, 0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background var(--duration-fast)',
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: 'var(--color-accent)',
                        color: '#1A1204',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(242, 179, 61, 0.4)',
                        transition: 'transform var(--duration-fast)',
                      }}
                    >
                      <Play size={28} fill="currentColor" style={{ marginLeft: 3 }} />
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            className="glass"
            style={{
              padding: '36px 20px',
              borderRadius: 'var(--radius-card)',
              textAlign: 'center',
              maxWidth: 820,
            }}
          >
            <Film size={32} color="var(--color-muted)" style={{ margin: '0 auto 10px' }} />
            <p style={{ color: 'var(--color-muted)', fontSize: 14, margin: 0 }}>
              No official trailer available for this title.
            </p>
          </div>
        )}
      </section>

      {/* ── Top Cast as Scrollable Glass Cards ────────────────────────────── */}
      {cast.length > 0 && (
        <section className="page-container" style={{ paddingBottom: 24 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 600,
              marginBottom: 16,
              color: 'var(--color-text)',
            }}
          >
            Top Cast
          </h2>

          <div
            className="scroll-row"
            style={{
              gap: 14,
              paddingBottom: 16,
            }}
          >
            {cast.map((member) => (
              <div
                key={member.id}
                className="glass"
                style={{
                  flex: '0 0 140px',
                  minWidth: 140,
                  borderRadius: 'var(--radius-card)',
                  overflow: 'hidden',
                  textAlign: 'center',
                  scrollSnapAlign: 'start',
                  transition: 'transform var(--duration-fast)',
                }}
              >
                <div style={{ aspectRatio: '3/4', background: 'rgba(0,0,0,0.3)' }}>
                  <ImageWithFallback
                    src={profileUrl(member.profile_path, 'w185')}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '10px 8px 12px' }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      marginBottom: 2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {member.name}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: 'var(--color-muted)',
                      lineHeight: 1.3,
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {member.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Similar & Recommended Rows ───────────────────────────────────── */}
      <section className="page-container" style={{ paddingBottom: 48 }}>
        {movie.similar?.results?.length > 0 && (
          <MovieRow
            title="Similar Movies"
            movies={movie.similar.results.slice(0, 15)}
            loading={false}
            error={null}
          />
        )}

        {movie.recommendations?.results?.length > 0 && (
          <MovieRow
            title="Recommended Movies"
            movies={movie.recommendations.results.slice(0, 15)}
            loading={false}
            error={null}
          />
        )}
      </section>
    </Layout>
  )
}
