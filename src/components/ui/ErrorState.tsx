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
  TIMEOUT: Clock,
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
    if (isOffline) {
      heading = "You're Offline"
      message = message || "Check your internet connection and try again."
    } else if (effectiveType === 'TIMEOUT') {
      heading = 'Request Timed Out'
      message = message || 'The server took too long to respond. Please try again.'
    } else if (effectiveType === 'NETWORK') {
      heading = 'Connection Error'
      message = message || 'Unable to reach the movie service. Please check your network or try again.'
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
          padding: '12px 14px',
          borderRadius: 'var(--radius-card)',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(239, 68, 68, 0.22)',
          fontSize: 13,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Icon size={16} color="#F87171" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{heading}: </span>
          <span style={{ wordBreak: 'break-word' }}>{message}</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn-glass"
            style={{
              padding: '6px 14px',
              minHeight: 44,
              fontSize: 12,
              borderRadius: 'var(--radius-btn)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
              color: 'var(--color-text)',
              flexShrink: 0,
            }}
          >
            <RotateCcw size={13} />
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
        padding: '48px 16px',
        gap: 18,
        textAlign: 'center',
        color: 'var(--color-muted)',
        maxWidth: 520,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
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
        <Icon size={28} strokeWidth={1.5} />
      </div>

      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--color-text)',
            fontSize: 20,
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
              minHeight: 44,
              fontSize: 14,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
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
              minHeight: 44,
              fontSize: 14,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
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
