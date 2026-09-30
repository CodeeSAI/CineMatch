import { WifiOff, RotateCcw } from 'lucide-react'

interface Props {
  onRetry?: () => void
  compact?: boolean
  message?: string
  className?: string
}

export function OfflineState({
  onRetry,
  compact = false,
  message = "Check your internet connection and try again.",
  className = '',
}: Props) {
  if (compact) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`offline-state-compact ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 14px',
          borderRadius: 'var(--radius-card)',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.20)',
          color: '#F87171',
          fontSize: 13,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <WifiOff size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontWeight: 600 }}>You're offline. </span>
          <span style={{ color: 'var(--color-muted)' }}>{message}</span>
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
      role="status"
      aria-live="polite"
      className={`offline-state-full ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
        textAlign: 'center',
        margin: '0 auto',
        maxWidth: 480,
        width: '100%',
        boxSizing: 'border-box',
        gap: 18,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.10)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#EF4444',
          boxShadow: '0 8px 24px rgba(239, 68, 68, 0.15)',
        }}
      >
        <WifiOff size={28} strokeWidth={1.75} />
      </div>

      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--color-text)',
            marginBottom: 8,
          }}
        >
          You're Offline
        </h2>
        <p
          style={{
            fontSize: 14,
            color: 'var(--color-muted)',
            lineHeight: 1.5,
            margin: '0 auto',
            maxWidth: 380,
          }}
        >
          {message}
        </p>
        <p
          style={{
            fontSize: 12,
            color: 'var(--color-subtle)',
            marginTop: 8,
          }}
        >
          Some previously loaded content may still be available.
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn-primary"
          style={{
            padding: '10px 24px',
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
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  )
}
