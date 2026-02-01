import { useEffect, useState } from "react"
export const useDebounceValue = <T>(value: T, delay = 300): T => {
  const [debouncedValue, setDebounceValue] = useState<T>(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounceValue(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debouncedValue
}
