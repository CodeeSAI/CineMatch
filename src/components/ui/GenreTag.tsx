import { getGenreColor } from '../../lib/genreColors'

interface Props {
  label: string
  small?: boolean
}

/** Pill badge for genre labels in curated cinema neon color */
export function GenreTag({ label, small = false }: Props) {
  const colors = getGenreColor(label)

  return (
    <span
      style={{
        display: 'inline-block',
        padding: small ? '2px 8px' : '3px 10px',
        borderRadius: 'var(--radius-pill)',
        border: `1px solid ${colors.border}`,
        background: colors.bg,
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        color: colors.accent,
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
      }}
    >
      {label}
    </span>
  )
}

