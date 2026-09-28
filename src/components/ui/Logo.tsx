/** CineMatch inline SVG logo mark + wordmark */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={Math.round(size * 4.3)}
      height={size}
      viewBox="0 0 130 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CineMatch"
      role="img"
      className="logo-shimmer"
      style={{ overflow: 'visible', display: 'block', flexShrink: 0 }}
    >
      {/* ── Film frame square with cinema neon sun stroke ── */}
      <rect x="1" y="1" width="28" height="28" rx="6" stroke="#FFC533" strokeWidth="1.6" />
      {/* Sprocket holes — top */}
      <rect x="4.5" y="3.5" width="3" height="3" rx="0.8" fill="#FFC533" opacity="0.65" />
      <rect x="10.5" y="3.5" width="3" height="3" rx="0.8" fill="#FFC533" opacity="0.65" />
      <rect x="16.5" y="3.5" width="3" height="3" rx="0.8" fill="#FFC533" opacity="0.65" />
      <rect x="22.5" y="3.5" width="3" height="3" rx="0.8" fill="#FFC533" opacity="0.65" />
      {/* Sprocket holes — bottom */}
      <rect x="4.5" y="23.5" width="3" height="3" rx="0.8" fill="#FFC533" opacity="0.65" />
      <rect x="10.5" y="23.5" width="3" height="3" rx="0.8" fill="#FFC533" opacity="0.65" />
      <rect x="16.5" y="23.5" width="3" height="3" rx="0.8" fill="#FFC533" opacity="0.65" />
      <rect x="22.5" y="23.5" width="3" height="3" rx="0.8" fill="#FFC533" opacity="0.65" />
      {/* Aperture / play mark inside frame with crimson play */}
      <circle cx="15" cy="15" r="5.5" fill="#FF3B5C" opacity="0.18" />
      <polygon points="12.5,12 12.5,18 19,15" fill="#FF3B5C" />

      {/* ── Wordmark ── */}
      <text
        x="36"
        y="20.5"
        fontFamily="'DM Sans', sans-serif"
        fontWeight="700"
        fontSize="15"
        fill="#F7F3FF"
        letterSpacing="0.2"
      >
        Cine
        <tspan fill="#FF3B5C">Match</tspan>
      </text>
    </svg>
  )
}
