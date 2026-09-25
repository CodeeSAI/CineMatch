import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { Home, Compass } from 'lucide-react'

/** Simple SVG clapperboard illustration for the 404 page */
function ClapperboardSVG() {
  return (
    <svg width="88" height="78" viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Board body */}
      <rect x="8" y="28" width="64" height="34" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />
      {/* Clapper top */}
      <rect x="8" y="18" width="64" height="14" rx="4" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />
      {/* Clapper stripes */}
      <line x1="22" y1="18" x2="18" y2="32" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="18" x2="31" y2="32" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
      <line x1="48" y1="18" x2="44" y2="32" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
      <line x1="61" y1="18" x2="57" y2="32" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
      {/* Hinge line */}
      <line x1="8" y1="32" x2="72" y2="32" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      {/* 404 text inside board */}
      <text x="40" y="52" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontWeight="700" fontSize="18" fill="rgba(242, 179, 61, 0.4)">
        404
      </text>
    </svg>
  )
}

export default function NotFoundPage() {
  return (
    <Layout title="Page not found">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <div
          className="glass-strong"
          style={{
            maxWidth: 520,
            width: '100%',
            padding: '48px 36px',
            borderRadius: 'var(--radius-card)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <ClapperboardSVG />

          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32,
                fontWeight: 600,
                color: 'var(--color-text)',
                marginBottom: 10,
              }}
            >
              Scene Not Found
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: 15, maxWidth: 360, margin: '0 auto' }}>
              The reel you're looking for doesn't exist, was moved, or cut from the final premiere.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            <Link
              to="/"
              className="btn-primary"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Home size={15} /> Go Home
            </Link>
            <Link
              to="/discover"
              className="btn-glass"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Compass size={15} /> Browse Movies
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
