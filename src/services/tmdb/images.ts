// ─── TMDB image URL helpers ────────────────────────────────────────────────────

const IMAGE_BASE = 'https://image.tmdb.org/t/p'

/** Returns null if path is missing — ImageWithFallback handles the null case */
export function posterUrl(path: string | null, size: 'w342' | 'w500' | 'w780' = 'w342'): string | null {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

export function backdropUrl(path: string | null, size: 'w780' | 'w1280' = 'w1280'): string | null {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

export function profileUrl(path: string | null, size: 'w185' | 'w342' = 'w185'): string | null {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}
