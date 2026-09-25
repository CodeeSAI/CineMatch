/** Single skeleton card matching MovieCard proportions and 14px radius */
export function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--color-glass-border)',
        boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Poster placeholder */}
      <div className="skeleton poster-ratio" style={{ width: '100%' }} />
      {/* Info placeholder */}
      <div style={{ padding: '12px' }}>
        <div
          className="skeleton"
          style={{ height: 14, borderRadius: 4, marginBottom: 8, width: '85%' }}
        />
        <div
          className="skeleton"
          style={{ height: 12, borderRadius: 4, width: '50%' }}
        />
      </div>
    </div>
  )
}

/** Row of skeleton cards for loading states */
export function SkeletonRow({ count = 8 }: { count?: number }) {
  return (
    <div className="scroll-row-wrapper" style={{ pointerEvents: 'none' }}>
      <div className="scroll-row">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="movie-row__card">
            <SkeletonCard />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Grid of skeleton cards */
export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 16,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

/** Hero-sized skeleton — shown while first trending movie loads */
export function SkeletonHero() {
  return (
    <div
      className="hero"
      style={{
        width: '100%',
        minHeight: 560,
        display: 'flex',
        alignItems: 'flex-end',
        padding: '32px 24px 48px',
        background: '#07080D',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="page-container"
        style={{ width: '100%', position: 'relative', zIndex: 2 }}
      >
        <div
          className="glass-strong"
          style={{
            maxWidth: 580,
            borderRadius: 20,
            padding: '32px',
            background: 'rgba(14, 16, 24, 0.84)',
          }}
        >
          <div
            className="skeleton"
            style={{ height: 16, width: 120, borderRadius: 9999, marginBottom: 16 }}
          />
          <div
            className="skeleton"
            style={{ height: 38, width: '85%', borderRadius: 6, marginBottom: 14 }}
          />
          <div
            className="skeleton"
            style={{ height: 14, width: 220, borderRadius: 4, marginBottom: 14 }}
          />
          <div
            className="skeleton"
            style={{ height: 13, width: '95%', borderRadius: 4, marginBottom: 6 }}
          />
          <div
            className="skeleton"
            style={{ height: 13, width: '80%', borderRadius: 4, marginBottom: 24 }}
          />
          <div style={{ display: 'flex', gap: 12 }}>
            <div
              className="skeleton"
              style={{ height: 40, width: 140, borderRadius: 'var(--radius-btn)' }}
            />
            <div
              className="skeleton"
              style={{ height: 40, width: 160, borderRadius: 'var(--radius-btn)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
