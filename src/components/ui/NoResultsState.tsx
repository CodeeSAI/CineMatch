import { Search, Compass, X } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  query?: string
  onClear?: () => void
  browseLink?: string
}

export function NoResultsState({
  query,
  onClear,
  browseLink = '/discover',
}: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="no-results-state"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        margin: '0 auto',
        maxWidth: 520,
        gap: 20,
      }}
    >
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--color-glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-muted)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.40)',
        }}
      >
        <Search size={30} strokeWidth={1.5} />
      </div>

      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--color-text)',
            marginBottom: 8,
          }}
        >
          {query ? `No results for “${query}”` : 'No movies found'}
        </h2>
        <p
          style={{
            fontSize: 14,
            color: 'var(--color-muted)',
            lineHeight: 1.5,
            maxWidth: 380,
            margin: '0 auto',
          }}
        >
          Try searching for a different title, actor, director, or keyword.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="btn-glass"
            style={{
              padding: '9px 18px',
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <X size={14} />
            <span>Clear Search</span>
          </button>
        )}

        {browseLink && (
          <Link
            to={browseLink}
            className="btn-primary"
            style={{
              padding: '9px 20px',
              fontSize: 13,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <Compass size={14} />
            <span>Browse All Movies</span>
          </Link>
        )}
      </div>
    </div>
  )
}
