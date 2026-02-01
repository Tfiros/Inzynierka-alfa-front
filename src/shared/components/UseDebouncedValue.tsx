import { useEffect, useState } from "react"

type Args<T> = {
  value: T
  delayMs: number
}

const useDebouncedValue = <T,>({ value, delayMs }: Args<T>) => {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(t)
  }, [value, delayMs])

  return debounced
}

export default useDebouncedValue
