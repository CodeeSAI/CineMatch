import { useState, useEffect, useCallback } from 'react'
import { ApiError } from '../types'
import { useSlowNetwork } from './useSlowNetwork'

export interface FetchState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  isSlow: boolean
  isOffline: boolean
}

/**
 * Generic data-fetch hook with slow-network detection, offline handling, and auto-reconnect.
 * - Creates a new AbortController each time deps change.
 * - Aborts the previous request on cleanup.
 * - Sets error to null when a new request starts.
 * - Detects slow network without treating it as fatal.
 * - Detects offline status and auto-refetches when connection returns.
 * - Exposes a `refetch` function to manually re-run.
 */
export function useFetch<T>(
  fetchFn: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
  skip = false,
): FetchState<T> & { refetch: () => void } {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(!skip)
  const [error, setError] = useState<ApiError | null>(null)
  const [isOffline, setIsOffline] = useState(false)
  const [trigger, setTrigger] = useState(0)

  const isSlow = useSlowNetwork(loading, 3500)

  const refetch = useCallback(() => {
    setTrigger((n) => n + 1)
  }, [])

  // Auto-refetch when returning online if previously failed with network/offline error
  useEffect(() => {
    function handleOnline() {
      setIsOffline(false)
      if (error && (error.type === 'NETWORK' || !navigator.onLine)) {
        refetch()
      }
    }

    function handleOffline() {
      setIsOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [error, refetch])

  useEffect(() => {
    if (skip) {
      setData(null)
      setLoading(false)
      setError(null)
      return
    }

    // Check offline status before firing request
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setData(null)
      setLoading(false)
      setIsOffline(true)
      setError(new ApiError('NETWORK', 'You appear to be offline. Check your internet connection.'))
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)
    setIsOffline(false)

    fetchFn(controller.signal)
      .then((resData) => {
        if (!controller.signal.aborted) {
          setData(resData)
          setLoading(false)
          setError(null)
          setIsOffline(false)
        }
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return // silently ignore aborted requests
        const isOff = typeof navigator !== 'undefined' && !navigator.onLine
        setIsOffline(isOff)

        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(
                isOff ? 'NETWORK' : 'GENERIC',
                isOff
                  ? 'You appear to be offline. Check your internet connection.'
                  : err instanceof Error
                  ? err.message
                  : 'Unable to load content right now.',
              )

        setData(null)
        setLoading(false)
        setError(apiError)
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, trigger, skip])

  return { data, loading, error, isSlow, isOffline, refetch }
}
