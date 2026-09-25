import { Loader2 } from 'lucide-react'

interface Props {
  loading?: boolean
  onClick: () => void
  hasMore: boolean
}

/** Load More button shown at bottom of paginated lists */
export function LoadMoreButton({ loading = false, onClick, hasMore }: Props) {
  if (!hasMore) return null

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
      <button
        onClick={onClick}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 28px',
          borderRadius: 'var(--radius-btn)',
          border: '1px solid var(--color-border-strong)',
          background: 'transparent',
          color: loading ? 'var(--color-muted)' : 'var(--color-text)',
          cursor: loading ? 'default' : 'pointer',
          fontSize: 14,
          fontWeight: 500,
          transition: 'border-color 200ms, color 200ms',
        }}
        aria-label="Load more movies"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? 'Loading…' : 'Load more'}
      </button>
    </div>
  )
}
