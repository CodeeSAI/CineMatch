import { useState } from 'react'
import { Film } from 'lucide-react'

interface Props {
  src: string | null
  alt: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Renders an img tag; on error or missing src, shows a dark placeholder
 * with a film icon so the layout never breaks due to missing images.
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
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.04)',
          color: 'var(--color-subtle)',
        }}
      >
        <Film size={28} strokeWidth={1.5} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
