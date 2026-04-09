import { patch } from "@/shared/api/ApiClient"
import { useState, useCallback } from "react"

export function useUpdateCounterOfferStatus() {
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateStatus = useCallback(
    async (counterOfferId: number, statusId: number) => {
      setLoadingId(counterOfferId)
      setError(null)

      try {
        const res = await patch<null>(`/CounterOffers/${counterOfferId}`, {
          statusId,
        })

        if (!res.isSuccess) {
          setError(res.message ?? "Aktualizacja nieudana")
          return false
        }

        return true
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Request failed"

        setError(message)
        return false
      } finally {
        setLoadingId(null)
      }
    },
    []
  )

  return { updateStatus, loadingId, error }
}
