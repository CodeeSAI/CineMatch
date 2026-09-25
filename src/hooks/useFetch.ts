import { useState, useEffect, useCallback } from 'react'
import { ApiError } from '../types'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

/**
 * Generic data-fetch hook.
 * - Creates a new AbortController each time deps change.
 * - Aborts the previous request on cleanup.
 * - Sets error to null when a new request starts.
 * - Exposes a `refetch` function to manually re-run.
 *
 * @param fetchFn Function that takes an AbortSignal and returns a Promise<T>
 * @param deps    Dependency array — changing these triggers a new fetch
 * @param skip    When true, the fetch is not triggered (e.g. empty query)
 */
export function useFetch<T>(
  fetchFn: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
  skip = false,
): FetchState<T> & { refetch: () => void } {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: !skip, error: null })
  const [trigger, setTrigger] = useState(0)

  const refetch = useCallback(() => setTrigger((n) => n + 1), [])

  useEffect(() => {
    if (skip) {
      setState({ data: null, loading: false, error: null })
      return
    }

    const controller = new AbortController()
    setState({ data: null, loading: true, error: null })

    fetchFn(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ data, loading: false, error: null })
        }
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return // silently ignore aborted requests
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError('GENERIC', err instanceof Error ? err.message : 'Unknown error')
        setState({ data: null, loading: false, error: apiError })
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, trigger, skip])

  return { ...state, refetch }
}
