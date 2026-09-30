import { useState, useEffect } from 'react'
import { WifiOff, Wifi, RotateCcw } from 'lucide-react'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'

export function NetworkBanner() {
  const { isOnline, wasOffline } = useNetworkStatus()
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true)
      const timer = setTimeout(() => {
        setShowReconnected(false)
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline])

  if (!isOnline) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="network-banner network-banner--offline"
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 20px',
          borderRadius: 'var(--radius-pill)',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          color: '#F87171',
          fontSize: 13,
          fontWeight: 500,
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.60), 0 0 16px rgba(239, 68, 68, 0.20)',
          animation: 'slideUp 220ms ease forwards',
        }}
      >
        <WifiOff size={16} strokeWidth={2} />
        <span>You are currently offline.</span>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-pill)',
            color: '#FCA5A5',
            padding: '3px 10px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <RotateCcw size={12} />
          <span>Retry</span>
        </button>
      </div>
    )
  }

  if (showReconnected) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="network-banner network-banner--online"
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 20px',
          borderRadius: 'var(--radius-pill)',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(34, 197, 94, 0.35)',
          color: '#4ADE80',
          fontSize: 13,
          fontWeight: 500,
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.60), 0 0 16px rgba(34, 197, 94, 0.20)',
          animation: 'slideUp 220ms ease forwards',
        }}
      >
        <Wifi size={16} strokeWidth={2} />
        <span>Back online. Connection restored.</span>
      </div>
    )
  }

  return null
}
