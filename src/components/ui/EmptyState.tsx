import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Film } from 'lucide-react'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  actionLabel?: string
  actionLink?: string
  onAction?: () => void
  className?: string
  compact?: boolean
}

/**
 * Premium cinematic empty state component.
 * Used for empty Favorites, empty Watchlist, empty genre collections, etc.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
  actionLink,
  onAction,
  className = '',
  compact = false,
}: EmptyStateProps) {
  const renderedIcon = icon ?? <Film size={compact ? 24 : 32} strokeWidth={1.5} />

  const renderedAction = action ?? (
    actionLabel ? (
      actionLink ? (
        <Link
          to={actionLink}
          className="btn-primary"
          style={{
            padding: '9px 20px',
            fontSize: 13,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {actionLabel}
        </Link>
      ) : onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="btn-primary"
          style={{
            padding: '9px 20px',
            fontSize: 13,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          {actionLabel}
        </button>
      ) : null
    ) : null
  )

  if (compact) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`empty-state-compact ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '36px 16px',
          gap: 12,
          textAlign: 'center',
          color: 'var(--color-muted)',
          borderRadius: 'var(--radius-card)',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--color-glass-border)',
        }}
      >
        <div style={{ opacity: 0.7, color: 'var(--color-accent)' }}>{renderedIcon}</div>
        <div>
          <p style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 15, margin: 0 }}>
            {title}
          </p>
          {description && (
            <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: '4px 0 0', maxWidth: 280 }}>
              {description}
            </p>
          )}
        </div>
        {renderedAction && <div style={{ marginTop: 6 }}>{renderedAction}</div>}
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`empty-state-full ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        gap: 20,
        textAlign: 'center',
        color: 'var(--color-muted)',
        maxWidth: 520,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--color-glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-muted)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.40)',
        }}
      >
        {renderedIcon}
      </div>

      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--color-text)',
            fontSize: 22,
            marginBottom: 8,
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              fontSize: 14,
              color: 'var(--color-muted)',
              lineHeight: 1.5,
              maxWidth: 380,
              margin: '0 auto',
            }}
          >
            {description}
          </p>
        )}
      </div>

      {renderedAction && <div style={{ marginTop: 4 }}>{renderedAction}</div>}
    </div>
  )
}
