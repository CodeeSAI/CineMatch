// ─── Formatting helpers ────────────────────────────────────────────────────────

/** Format runtime in minutes to "2h 15m" */
export function formatRuntime(minutes: number | null): string {
  if (!minutes || minutes <= 0) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/** Extract 4-digit year from a date string like "2023-07-14" */
export function formatYear(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return dateStr.slice(0, 4)
}

/** Format a full date to "14 Jul 2023" */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

/** Round vote_average to one decimal place */
export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

/** Format large numbers with commas */
export function formatCount(n: number): string {
  return n.toLocaleString('en-US')
}
