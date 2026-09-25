import { useState, useCallback } from 'react'
import { storageGet, storageSet } from '../services/storage/base'

/**
 * Type-safe localStorage hook.
 * Reads once on mount; writes on every setValue call.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [stored, setStored] = useState<T>(() => storageGet<T>(key, initialValue))

  const setValue = useCallback(
    (value: T) => {
      setStored(value)
      storageSet(key, value)
    },
    [key],
  )

  return [stored, setValue]
}
