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
          padding: '14px 18px',
          borderRadius: 'var(--radius-card)',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.20)',
          color: '#F87171',
          fontSize: 13,
        }}
      >
        <WifiOff size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 600 }}>You're offline. </span>
          <span style={{ color: 'var(--color-muted)' }}>{message}</span>
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
      role="status"
      aria-live="polite"
      className={`offline-state-full ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '72px 24px',
        textAlign: 'center',
        margin: '0 auto',
        maxWidth: 500,
        gap: 20,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
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
        <WifiOff size={32} strokeWidth={1.75} />
      </div>

      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24,
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
            fontSize: 14,
            display: 'inline-flex',
            alignItems: 'center',
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
