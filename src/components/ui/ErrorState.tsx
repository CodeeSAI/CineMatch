import type { ElementType } from 'react'
import { AlertCircle, WifiOff, KeyRound, Clock } from 'lucide-react'
import type { ApiError } from '../../types'

interface Props {
  error: ApiError | { type: string; message: string }
  onRetry?: () => void
  compact?: boolean
}

const ERROR_ICONS: Record<string, ElementType> = {
  MISSING_KEY: KeyRound,
  INVALID_KEY: KeyRound,
  RATE_LIMIT: Clock,
  NETWORK: WifiOff,
  GENERIC: AlertCircle,
}

const ERROR_LABELS: Record<string, string> = {
  MISSING_KEY: 'API key not configured',
  INVALID_KEY: 'Invalid API key',
  RATE_LIMIT: 'Too many requests',
  NETWORK: 'Network error',
  GENERIC: 'Something went wrong',
}

export function ErrorState({ error, onRetry, compact = false }: Props) {
  const Icon = ERROR_ICONS[error.type] ?? AlertCircle
  const label = ERROR_LABELS[error.type] ?? 'Something went wrong'

  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--color-muted)',
          padding: '16px 0',
          fontSize: 14,
        }}
      >
        <Icon size={16} />
        <span>{label}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              marginLeft: 8,
              padding: '2px 10px',
              borderRadius: 'var(--radius-btn)',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: 'var(--color-accent)',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Retry
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        gap: 16,
        textAlign: 'center',
        color: 'var(--color-muted)',
      }}
    >
      <Icon size={36} strokeWidth={1.5} />
      <div>
        <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 14 }}>{error.message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: 8,
            padding: '8px 20px',
            borderRadius: 'var(--radius-btn)',
            border: '1px solid var(--color-border-strong)',
            background: 'transparent',
            color: 'var(--color-accent)',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
            transition: 'border-color 200ms',
          }}
        >
          Try again
        </button>
      )}
    </div>
  )
}
