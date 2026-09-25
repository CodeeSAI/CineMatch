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
      style={{ overflow: 'visible', display: 'block', flexShrink: 0 }}
    >
      {/* ── Film frame square ── */}
      <rect x="1" y="1" width="28" height="28" rx="6" stroke="#E0A43A" strokeWidth="1.6" />
      {/* Sprocket holes — top */}
      <rect x="4.5" y="3.5" width="3" height="3" rx="0.8" fill="#E0A43A" opacity="0.55" />
      <rect x="10.5" y="3.5" width="3" height="3" rx="0.8" fill="#E0A43A" opacity="0.55" />
      <rect x="16.5" y="3.5" width="3" height="3" rx="0.8" fill="#E0A43A" opacity="0.55" />
      <rect x="22.5" y="3.5" width="3" height="3" rx="0.8" fill="#E0A43A" opacity="0.55" />
      {/* Sprocket holes — bottom */}
      <rect x="4.5" y="23.5" width="3" height="3" rx="0.8" fill="#E0A43A" opacity="0.55" />
      <rect x="10.5" y="23.5" width="3" height="3" rx="0.8" fill="#E0A43A" opacity="0.55" />
      <rect x="16.5" y="23.5" width="3" height="3" rx="0.8" fill="#E0A43A" opacity="0.55" />
      <rect x="22.5" y="23.5" width="3" height="3" rx="0.8" fill="#E0A43A" opacity="0.55" />
      {/* Aperture / play mark inside frame */}
      <circle cx="15" cy="15" r="5.5" fill="#E0A43A" opacity="0.12" />
      <polygon points="12.5,12 12.5,18 19,15" fill="#E0A43A" />

      {/* ── Wordmark ── */}
      <text
        x="36"
        y="20.5"
        fontFamily="'DM Sans', sans-serif"
        fontWeight="600"
        fontSize="14"
        fill="#EDEBE6"
        letterSpacing="0.2"
      >
        Cine
        <tspan fill="#E0A43A">Match</tspan>
      </text>
    </svg>
  )
}
