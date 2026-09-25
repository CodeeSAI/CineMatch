import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit3, Check, X, Star, History, Globe, Sparkles } from 'lucide-react'
import { Layout } from '../../components/layout/Layout'
import { ImageWithFallback } from '../../components/ui/ImageWithFallback'
import { useLibrary } from '../../context/LibraryContext'
import { useGenres } from '../../context/GenresContext'
import { getProfile, saveProfile } from '../../services/storage/profile'
import { posterUrl } from '../../services/tmdb/images'
import { formatYear, formatRating } from '../../lib/format'
import { INDIAN_LANGUAGES, WORLD_LANGUAGES, getLanguageName } from '../../lib/languages'
import type { UserProfile } from '../../types'

const AVATAR_COLORS = [
  '#F2B33D', // CineMatch Gold
  '#FF5C7A', // Rose
  '#6D7CFF', // Indigo
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F97316', // Orange
  '#06B6D4', // Cyan
]

export default function ProfilePage() {
  const { favorites, watchlist, ratings, recentlyViewed } = useLibrary()
  const { genres } = useGenres()

  const [profile, setProfileState] = useState<UserProfile>(() => getProfile())
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<UserProfile>(profile)

  const ratedCount = Object.keys(ratings).length
  const last12Recent = recentlyViewed.slice(0, 12)

  // Derive initials
  const initials = (profile.displayName.trim() || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

  function handleStartEdit() {
    setDraft({ ...profile })
    setIsEditing(true)
  }

  function handleCancelEdit() {
    setDraft({ ...profile })
    setIsEditing(false)
  }

  function handleSaveEdit() {
    saveProfile(draft)
    setProfileState({ ...draft })
    setIsEditing(false)
  }

  function toggleGenre(id: number) {
    setDraft((prev) => {
      const exists = prev.favoriteGenreIds.includes(id)
      return {
        ...prev,
        favoriteGenreIds: exists
          ? prev.favoriteGenreIds.filter((gid) => gid !== id)
          : [...prev.favoriteGenreIds, id],
      }
    })
  }

  const preferredLangDisplay = getLanguageName(profile.preferredLanguage)

  return (
    <Layout title="Profile">
      <div className="page-container" style={{ maxWidth: 1040 }}>
        {/* Header & Avatar Card */}
        <div
          className="glass-strong"
          style={{
            borderRadius: 'var(--radius-card)',
            padding: '28px 24px',
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
            border: '1px solid var(--color-glass-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Avatar Circle with Gold Ring */}
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                background: isEditing ? draft.avatarColor : profile.avatarColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                fontWeight: 700,
                color: '#1A1204',
                border: '3px solid var(--color-accent)',
                boxShadow: '0 0 20px rgba(242, 179, 61, 0.4), 0 8px 24px rgba(0,0,0,0.4)',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>

            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 26,
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  marginBottom: 6,
                }}
              >
                {profile.displayName}
              </h1>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontSize: 13,
                  color: 'var(--color-muted)',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--color-glass-border)',
                  }}
                >
                  <Globe size={13} color="var(--color-accent)" />
                  Preferred Language: <strong style={{ color: 'var(--color-text)' }}>{preferredLangDisplay}</strong>
                </span>
              </div>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={handleStartEdit}
              className="btn-glass"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Edit3 size={15} /> Edit Profile
            </button>
          )}
        </div>

        {/* ── Edit Mode Form ── */}
        {isEditing && (
          <div
            className="filter-panel"
            style={{ marginBottom: 36, padding: '28px' }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--color-text)',
                marginBottom: 20,
              }}
            >
              Edit Profile
            </h2>

            <div style={{ display: 'grid', gap: 20, marginBottom: 24 }}>
              {/* Display name */}
              <div>
                <label htmlFor="display-name-input" className="filter-label">
                  Display Name
                </label>
                <input
                  id="display-name-input"
                  type="text"
                  className="input-glass"
                  value={draft.displayName}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, displayName: e.target.value }))
                  }
                  placeholder="e.g. Cinema Enthusiast"
                  maxLength={30}
                />
              </div>

              {/* Avatar Color Picker */}
              <div>
                <label className="filter-label">Avatar Color</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {AVATAR_COLORS.map((col) => {
                    const isSelected = draft.avatarColor === col
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() =>
                          setDraft((prev) => ({ ...prev, avatarColor: col }))
                        }
                        aria-label={`Select color ${col}`}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: col,
                          border: isSelected
                            ? '3px solid #FFF'
                            : '2px solid transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isSelected ? '0 0 12px rgba(255,255,255,0.4)' : 'none',
                          transition: 'transform var(--duration-fast)',
                        }}
                      >
                        {isSelected && <Check size={16} color="#1A1204" strokeWidth={3} />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Preferred Language with Indian & World groups */}
              <div>
                <label htmlFor="language-select" className="filter-label">
                  Preferred Language (Boosts recommendations)
                </label>
                <select
                  id="language-select"
                  className="filter-select"
                  value={draft.preferredLanguage}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      preferredLanguage: e.target.value,
                    }))
                  }
                >
                  <optgroup label="Indian languages">
                    {INDIAN_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="World languages">
                    {WORLD_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.nativeName !== lang.name ? `${lang.name} (${lang.nativeName})` : lang.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Favorite Genres Multi-select */}
              <div>
                <label className="filter-label">
                  Favourite Genres (Shapes movie recommendations)
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {genres.map((g) => {
                    const active = draft.favoriteGenreIds.includes(g.id)
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => toggleGenre(g.id)}
                        className={active ? 'quick-chip quick-chip--active' : 'quick-chip'}
                      >
                        {active && <Check size={12} />}
                        {g.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Check size={16} /> Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-glass"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Stats Tiles ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
            marginBottom: 36,
          }}
        >
          {[
            { label: 'Favourites', value: favorites.length, link: '/favorites' },
            { label: 'Watchlist', value: watchlist.length, link: '/watchlist' },
            { label: 'Rated Movies', value: ratedCount, link: null },
          ].map(({ label, value, link }) => {
            const content = (
              <div
                className="glass"
                style={{
                  padding: '24px 20px',
                  borderRadius: 'var(--radius-card)',
                  textAlign: 'center',
                  transition: 'border-color var(--duration-fast), transform var(--duration-fast)',
                }}
              >
                <p
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                    marginBottom: 4,
                  }}
                >
                  {value}
                </p>
                <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: 0, fontWeight: 500 }}>
                  {label}
                </p>
              </div>
            )

            return link ? (
              <Link
                key={label}
                to={link}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {content}
              </Link>
            ) : (
              <div key={label}>{content}</div>
            )
          })}
        </div>

        {/* ── Favourite Genres Pill Display ── */}
        {profile.favoriteGenreIds.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                fontWeight: 600,
                color: 'var(--color-text)',
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Sparkles size={18} color="var(--color-accent)" /> Favourite Genres
            </h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {profile.favoriteGenreIds.map((gid) => {
                const genre = genres.find((g) => g.id === gid)
                if (!genre) return null
                return (
                  <Link
                    key={gid}
                    to={`/genres/${gid}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <span className="quick-chip quick-chip--active">
                      {genre.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Recently Viewed Section (Last 12) ── */}
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <History size={20} color="var(--color-accent)" /> Recently Viewed
          </h2>

          {last12Recent.length === 0 ? (
            <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>
              You haven't viewed any movies yet. Explore titles on the Discover page.
            </p>
          ) : (
            <div className="movie-grid">
              {last12Recent.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
