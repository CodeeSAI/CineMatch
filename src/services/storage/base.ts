// ─── Generic localStorage helpers ─────────────────────────────────────────────
// Versioned namespace prefix: changing v1_ → v2_ allows clean migration later.

export const STORAGE_PREFIX = 'cinematch_v1_'

/** Read a JSON value from localStorage; returns fallback on any error */
export function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** Write a JSON value to localStorage; silently ignores quota/security errors */
export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
  } catch {
    // localStorage may be unavailable in private browsing or when full
  }
}

export function storageRemove(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
  } catch {
    // ignore
  }
}
