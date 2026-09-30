/** Single skeleton card matching MovieCard proportions and 14px radius */
export function SkeletonCard() {
  return (
    <div className="stream-card movie-card" style={{ pointerEvents: 'none', height: '100%' }}>
      {/* Poster placeholder — strict 2:3 aspect ratio */}
      <div className="stream-card__media movie-card__poster poster-ratio">
        <div className="skeleton" style={{ width: '100%', height: '100%' }} />
      </div>
      {/* Info placeholder — 72px consistent body height */}
      <div className="stream-card__info movie-card__body">
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

/** Row of skeleton cards for horizontal scroll rows (Trending, Popular, etc.) */
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

/** Grid of skeleton cards matching the deterministic movie-grid */
export function SkeletonGrid({ count = 15 }: { count?: number }) {
  return (
    <div className="movie-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="movie-card-cell">
          <SkeletonCard />
        </div>
      ))}
    </div>
  )
}

/** Hero-sized skeleton — shown while hero trending movie loads */
export function SkeletonHero() {
  return (
    <div
      className="hero-container"
      style={{ width: '100%', position: 'relative', overflow: 'hidden' }}
    >
      <div
        className="hero-cinematic"
        style={{
          width: '100%',
          minHeight: 560,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '40px 32px 52px',
          background: '#07080D',
          position: 'relative',
        }}
      >
        <div
          style={{
            maxWidth: 620,
            width: '100%',
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* Eyebrow badge skeleton */}
          <div
            className="skeleton"
            style={{ height: 22, width: 130, borderRadius: 9999, marginBottom: 4 }}
          />
          {/* Title skeleton */}
          <div
            className="skeleton"
            style={{ height: 44, width: '85%', borderRadius: 8 }}
          />
          {/* Metadata pills skeleton */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="skeleton" style={{ height: 20, width: 54, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 16, width: 40, borderRadius: 4 }} />
            <div className="skeleton" style={{ height: 20, width: 70, borderRadius: 9999 }} />
            <div className="skeleton" style={{ height: 20, width: 80, borderRadius: 9999 }} />
          </div>
          {/* Overview lines skeleton */}
          <div
            className="skeleton"
            style={{ height: 14, width: '95%', borderRadius: 4, marginTop: 4 }}
          />
          <div
            className="skeleton"
            style={{ height: 14, width: '80%', borderRadius: 4 }}
          />
          {/* Buttons skeleton */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <div
              className="skeleton"
              style={{ height: 42, width: 140, borderRadius: 'var(--radius-btn)' }}
            />
            <div
              className="skeleton"
              style={{ height: 42, width: 160, borderRadius: 'var(--radius-btn)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Full-page Movie Details Skeleton preserving the exact layout structure */
export function SkeletonDetails() {
  return (
    <div style={{ minHeight: '80vh', background: 'var(--color-bg)', paddingBottom: 64 }}>
      {/* Hero Backdrop Section */}
      <div
        style={{
          position: 'relative',
          minHeight: '60vh',
          background: 'linear-gradient(180deg, #090B14 0%, var(--color-bg) 100%)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '0 24px 48px',
        }}
      >
        <div
          className="page-container"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            gap: 36,
            alignItems: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          {/* Poster placeholder */}
          <div
            style={{
              width: 220,
              aspectRatio: '2 / 3',
              borderRadius: 14,
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
            }}
          >
            <div className="skeleton" style={{ width: '100%', height: '100%' }} />
          </div>

          {/* Details header info */}
          <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="skeleton" style={{ height: 38, width: '75%', borderRadius: 8 }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="skeleton" style={{ height: 20, width: 60, borderRadius: 6 }} />
              <div className="skeleton" style={{ height: 20, width: 50, borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 20, width: 70, borderRadius: 4 }} />
            </div>
            <div className="skeleton" style={{ height: 16, width: '90%', borderRadius: 4, marginTop: 8 }} />
            <div className="skeleton" style={{ height: 16, width: '80%', borderRadius: 4 }} />
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <div className="skeleton" style={{ height: 42, width: 140, borderRadius: 'var(--radius-btn)' }} />
              <div className="skeleton" style={{ height: 42, width: 160, borderRadius: 'var(--radius-btn)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Cast strip skeleton */}
      <div className="page-container" style={{ maxWidth: 1200, margin: '40px auto 0', padding: '0 24px' }}>
        <div className="skeleton" style={{ height: 24, width: 120, borderRadius: 6, marginBottom: 20 }} />
        <div style={{ display: 'flex', gap: 16, overflow: 'hidden' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ width: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div className="skeleton" style={{ width: 76, height: 76, borderRadius: '50%' }} />
              <div className="skeleton" style={{ width: 68, height: 12, borderRadius: 4 }} />
              <div className="skeleton" style={{ width: 50, height: 10, borderRadius: 4 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
