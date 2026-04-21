import { CounterOfferService } from "@/shared/api/services/CounterOfferService"
import { useState, useCallback } from "react"
import { useAppStore } from "@/shared/store/appStore"

export function useUpdateCounterOfferStatus() {
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const inc = useAppStore((s) => s.inc)
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)

  const updateStatus = useCallback(
    async (counterOfferId: number, statusId: number) => {
      setLoadingId(counterOfferId)
      setError(null)

      try {
        const res = await CounterOfferService.updateStatus(
          counterOfferId,
          statusId
        )

        if (!res.isSuccess) {
          setError(res.message ?? "Aktualizacja nieudana")
          return false
        }

        inc("counterOffers:sent")
        inc("counterOffers:received")
        await refreshNavbar()

        return true
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Request failed"
        setError(message)
        return false
      } finally {
        setLoadingId(null)
      }
    },
    [inc, refreshNavbar]
  )

  return { updateStatus, loadingId, error }
}
