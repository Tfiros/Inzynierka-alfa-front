import api from "@/shared/api/Api"
import { useState, useCallback } from "react"

export function useUpdateCounterOfferStatus() {
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateStatus = useCallback(
    async (counterOfferId: number, statusId: number) => {
      setLoadingId(counterOfferId)
      setError(null)

      try {
        const res = await api.patch(`/CounterOffers/${counterOfferId}`, {
          statusId,
        })

        if (!res.data.isSuccess) {
          setError(res.data.message)
          return false
        }

        return true
      } catch (e: any) {
        setError(e?.message ?? "Request failed")
        return false
      } finally {
        setLoadingId(null)
      }
    },
    []
  )

  return { updateStatus, loadingId, error }
}
