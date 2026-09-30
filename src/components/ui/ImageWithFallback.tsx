import { useState } from 'react'
import { Film } from 'lucide-react'

interface Props {
  src: string | null
  alt: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Robust image component with graceful dark placeholder fallback.
 * Prevents layout shifts and broken image indicators when network or TMDB asset fails.
 */
export function ImageWithFallback({ src, alt, className = '', style }: Props) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={className}
        aria-label={alt}
        role="img"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #090B14 0%, #0E121E 100%)',
          color: 'var(--color-subtle)',
          padding: 12,
          gap: 6,
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <Film size={26} strokeWidth={1.5} style={{ opacity: 0.6 }} />
        <span
          style={{
            fontSize: 11,
            color: 'var(--color-muted)',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: '90%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            opacity: 0.75,
          }}
        >
          {alt ? alt.replace(/ poster$/i, '') : 'No image'}
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        ...style,
      }}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
