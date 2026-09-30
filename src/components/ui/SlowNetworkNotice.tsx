import { Loader2 } from 'lucide-react'

interface Props {
  message?: string
  subMessage?: string
  className?: string
  inline?: boolean
}

/**
 * Non-blocking indicator displayed when requests take longer than expected (>3.5s).
 * Does not replace the skeleton UI or block the interface.
 */
export function SlowNetworkNotice({
  message = 'Taking a little longer than usual…',
  subMessage = "We're still loading your movies.",
  className = '',
  inline = false,
}: Props) {
  if (inline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`slow-network-inline ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 16px',
          borderRadius: 'var(--radius-pill)',
          background: 'rgba(30, 41, 59, 0.70)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(148, 163, 184, 0.16)',
          color: '#E2E8F0',
          fontSize: 13,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
        }}
      >
        <span className="slow-network-pulse" aria-hidden="true" />
        <span>{message}</span>
        {subMessage && (
          <span style={{ color: 'var(--color-muted)', fontSize: 12 }}>
            ({subMessage})
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`slow-network-notice ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '16px auto',
        maxWidth: 480,
        padding: '10px 18px',
        borderRadius: 'var(--radius-card)',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(245, 158, 11, 0.20)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.40), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        animation: 'fadeIn 250ms ease forwards',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="slow-network-pulse" aria-hidden="true" />
          <Loader2 size={15} color="#F59E0B" className="slow-network-spinner" />
        </div>
        <div style={{ textAlign: 'left' }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#F1F5F9' }}>
            {message}
          </p>
          {subMessage && (
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
              {subMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
