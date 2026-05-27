import { useCallback } from "react"

type Props = {
  refetch: () => Promise<void>
  waitsMs?: number[]
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const useRefetchWithRetry = ({ refetch, waitsMs }: Props) => {
  return useCallback(async () => {
    const waits = waitsMs ?? [900]
    for (const w of waits) {
      if (w) await delay(w)
      await refetch()
    }
  }, [refetch, waitsMs])
}

export default useRefetchWithRetry
