import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

/** Centered empty state — used for empty Favorites, Watchlist, etc. */
export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '72px 24px',
        gap: 16,
        textAlign: 'center',
        color: 'var(--color-muted)',
      }}
    >
      <div style={{ opacity: 0.5 }}>{icon}</div>
      <div>
        <p style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 18, marginBottom: 6 }}>
          {title}
        </p>
        {description && <p style={{ fontSize: 14, maxWidth: 320 }}>{description}</p>}
      </div>
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  )
}
