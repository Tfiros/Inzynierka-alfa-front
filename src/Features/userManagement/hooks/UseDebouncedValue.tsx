import { useEffect, useState } from "react"

type Props<T> = {
  value: T
  delayMs: number
}

const UseDebouncedValue = <T,>({ value, delayMs }: Props<T>) => {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(t)
  }, [value, delayMs])

  return debounced
}

export default UseDebouncedValue
