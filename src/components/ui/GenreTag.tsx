interface Props {
  label: string
  small?: boolean
}

/** Pill badge for genre labels */
export function GenreTag({ label, small = false }: Props) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: small ? '2px 8px' : '3px 10px',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid var(--color-glass-border)',
        background: 'rgba(255, 255, 255, 0.04)',
        fontSize: small ? 11 : 12,
        fontWeight: 500,
        color: 'var(--color-muted)',
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
      }}
    >
      {label}
    </span>
  )
}
