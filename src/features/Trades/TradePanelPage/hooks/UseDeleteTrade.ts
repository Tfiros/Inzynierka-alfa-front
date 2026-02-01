import { TradeService } from "@/shared/api/services/TradeService"
import { useCallback, useState } from "react"

type Options = {
  onSuccess?: () => void
  onError?: (message: string) => void
}

const useDeleteTrade = (options?: Options) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [tradeId, setTradeId] = useState<number | null>(null)

  const openFor = useCallback((id: number) => {
    setTradeId(id)
    setOpen(true)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  const reset = useCallback(() => {
    setTradeId(null)
    setError(null)
  }, [])
  const deleteTrade = useCallback(async () => {
    if (tradeId === null) return false
    setLoading(true)
    setError(null)

    try {
      const res = await TradeService.setTradeAsFaild(tradeId)

      if (!res.isSuccess) {
        let message = "Nie udało się anulować wymiany."
        try {
          message = res.message ?? message
        } catch {}
        throw new Error(message)
      }

      options?.onSuccess?.()

      setOpen(false)

      return true
    } catch (e) {
      const message = e instanceof Error ? e.message : "Wystąpił błąd."
      setError(message)
      options?.onError?.(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [tradeId, options])

  return {
    open,
    setOpen,
    tradeId,
    loading,
    error,
    actions: { openFor, close, reset, deleteTrade },
  }
}

export default useDeleteTrade
