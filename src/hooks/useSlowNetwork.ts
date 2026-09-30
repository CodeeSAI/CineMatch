import { useState, useEffect } from 'react'

/**
 * Tracks if a request is taking longer than expected (default: 3500ms).
 * Automatically resets when loading ends.
 *
 * @param loading Whether the request is actively in-flight
 * @param delayMs Threshold in ms before flagging as slow (default: 3500)
 */
export function useSlowNetwork(loading: boolean, delayMs = 3500): boolean {
  const [isSlow, setIsSlow] = useState(false)

  useEffect(() => {
    if (!loading) {
      setIsSlow(false)
      return
    }

    const timer = setTimeout(() => {
      setIsSlow(true)
    }, delayMs)

    return () => clearTimeout(timer)
  }, [loading, delayMs])

  return isSlow
}
