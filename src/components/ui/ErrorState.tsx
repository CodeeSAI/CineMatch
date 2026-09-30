import type { ElementType, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, WifiOff, KeyRound, Clock, Film, RotateCcw, Home } from 'lucide-react'
import type { ApiError } from '../../types'

interface Props {
  error: ApiError | { type: string; message: string }
  onRetry?: () => void
  compact?: boolean
  title?: string
  description?: string
  showHomeButton?: boolean
  extraAction?: ReactNode
}

const ERROR_ICONS: Record<string, ElementType> = {
  MISSING_KEY: KeyRound,
  INVALID_KEY: KeyRound,
  RATE_LIMIT: Clock,
  NETWORK: WifiOff,
  NOT_FOUND: Film,
  GENERIC: AlertCircle,
}

export function ErrorState({
  error,
  onRetry,
  compact = false,
  title,
  description,
  showHomeButton = false,
  extraAction,
}: Props) {
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine
  const effectiveType = isOffline ? 'NETWORK' : error.type
  const Icon = ERROR_ICONS[effectiveType] ?? AlertCircle

  let heading = title
  let message = description || error.message

  if (!heading) {
    if (isOffline || effectiveType === 'NETWORK') {
      heading = "You're Offline"
      message = message || "Check your internet connection and try again."
    } else if (effectiveType === 'RATE_LIMIT') {
      heading = 'Too Many Requests'
      message = message || 'TMDB rate limit reached. Please wait a moment and try again.'
    } else if (effectiveType === 'MISSING_KEY' || effectiveType === 'INVALID_KEY') {
      heading = 'Service Configuration Error'
      message = message || 'The TMDB API key is not configured or is invalid.'
    } else if (effectiveType === 'NOT_FOUND') {
      heading = 'Movie Not Found'
      message = message || "We couldn't find the movie you requested."
    } else {
      heading = "Couldn't load movies"
      message = message || "We couldn't reach the movie service right now."
    }
  }

  if (compact) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="error-state-compact"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: 'var(--color-muted)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-card)',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(239, 68, 68, 0.22)',
          fontSize: 13,
        }}
      >
        <Icon size={16} color="#F87171" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{heading}: </span>
          <span>{message}</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn-glass"
            style={{
              padding: '4px 12px',
              fontSize: 12,
              borderRadius: 'var(--radius-btn)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              color: 'var(--color-text)',
            }}
          >
            <RotateCcw size={12} />
            <span>Retry</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="error-state-full"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '72px 24px',
        gap: 20,
        textAlign: 'center',
        color: 'var(--color-muted)',
        maxWidth: 520,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: '50%',
          background: isOffline ? 'rgba(239, 68, 68, 0.12)' : 'rgba(59, 130, 246, 0.12)',
          border: `1px solid ${isOffline ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.25)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isOffline ? '#EF4444' : 'var(--color-blue)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.40)',
        }}
      >
        <Icon size={32} strokeWidth={1.5} />
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
          {heading}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--color-muted)', maxWidth: 400, margin: '0 auto', lineHeight: 1.5 }}>
          {message}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn-primary"
            style={{
              padding: '10px 22px',
              fontSize: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={15} />
            <span>Try Again</span>
          </button>
        )}

        {showHomeButton && (
          <Link
            to="/"
            className="btn-glass"
            style={{
              padding: '10px 20px',
              fontSize: 14,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Home size={15} />
            <span>Go Home</span>
          </Link>
        )}

        {extraAction}
      </div>
    </div>
  )
}
