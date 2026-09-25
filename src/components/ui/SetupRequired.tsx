import { KeyRound, ExternalLink } from 'lucide-react'

/**
 * Shown when VITE_TMDB_API_KEY is missing or still set to the placeholder.
 * Gives clear setup instructions — no fake data is shown.
 */
export function SetupRequired() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'var(--color-bg)',
      }}
    >
      <div
        className="glass-strong"
        style={{
          maxWidth: 520,
          width: '100%',
          padding: '44px 36px',
          borderRadius: 'var(--radius-card)',
          textAlign: 'center',
          border: '1px solid var(--color-glass-border)',
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 58,
            height: 58,
            borderRadius: 16,
            background: 'var(--color-accent-dim)',
            border: '1px solid rgba(242, 179, 61, 0.3)',
            marginBottom: 24,
            boxShadow: '0 8px 24px rgba(242, 179, 61, 0.25)',
          }}
        >
          <KeyRound size={26} color="var(--color-accent)" />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 26,
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: 12,
          }}
        >
          Setup Required
        </h1>

        <p style={{ color: 'var(--color-muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
          CineMatch connects live to the TMDB API to load verified movie data.
          Add your free API key to your <code style={{ color: 'var(--color-accent)', fontSize: 13 }}>.env</code> file
          in the project root.
        </p>

        <div
          style={{
            background: 'rgba(7, 8, 13, 0.75)',
            borderRadius: 'var(--radius-btn)',
            padding: '16px 20px',
            textAlign: 'left',
            marginBottom: 26,
            fontFamily: 'monospace',
            fontSize: 13,
            color: 'var(--color-text)',
            border: '1px solid var(--color-glass-border)',
          }}
        >
          <div style={{ color: 'var(--color-muted)', marginBottom: 6, fontSize: 11 }}># .env</div>
          VITE_TMDB_API_KEY=<span style={{ color: 'var(--color-accent)' }}>your_api_key_here</span>
        </div>

        <ol
          style={{
            textAlign: 'left',
            color: 'var(--color-muted)',
            fontSize: 14,
            lineHeight: 1.8,
            paddingLeft: 20,
            marginBottom: 28,
          }}
        >
          <li>Create a free account at themoviedb.org</li>
          <li>Go to Settings → API and generate a Developer key</li>
          <li>Copy your v3 API key</li>
          <li>
            Paste into <code style={{ fontSize: 12, color: 'var(--color-accent)' }}>.env</code> or <code style={{ fontSize: 12, color: 'var(--color-accent)' }}>.env.local</code>
          </li>
          <li>Restart the dev server</li>
        </ol>

        <a
          href="https://www.themoviedb.org/settings/api"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ textDecoration: 'none' }}
        >
          <span>Get a TMDB API Key</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  )
}
