/** Slim frosted glass footer with TMDB attribution */
export function Footer() {
  return (
    <footer
      className="glass"
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--color-glass-border)',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        textAlign: 'center',
        background: 'rgba(7, 8, 13, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: 0, maxWidth: 520 }}>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
      <p style={{ fontSize: 12, color: 'var(--color-subtle)', margin: 0 }}>
        CineMatch — cinematic discovery · film data from{' '}
        <a
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--color-accent)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          TMDB
        </a>
      </p>
    </footer>
  )
}
