import { useEffect, useState } from "react"

const useDebouncedValue = <T>(value: T, delayMs: number) => {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(t)
  }, [value, delayMs])

  return debounced
}

export default useDebouncedValue
