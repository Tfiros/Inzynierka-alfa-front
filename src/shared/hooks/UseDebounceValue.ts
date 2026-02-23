import { useEffect, useState } from "react"

export const useDebounceValue = <T>(value: T, delayMs = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedValue(value), delayMs)
    return () => window.clearTimeout(t)
  }, [value, delayMs])
  return debouncedValue
}
