import { CounterOfferService } from "@/shared/api/services/CounterOfferService"
import { useAppStore } from "@/shared/store/appStore"
import { useCallback, useState } from "react"

export function useCancelCounterOffer() {
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const inc = useAppStore((s) => s.inc)
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)

  const cancelStatus = useCallback(
    async (counterOfferId: number) => {
      setLoadingId(counterOfferId)
      setError(null)

      try {
        const res = await CounterOfferService.cancel(counterOfferId)

        if (!res.isSuccess) {
          setError(res.message ?? "Anulowanie nieudane")
          return
        }
        inc("counterOffers:sent")
        void refreshNavbar()
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Request failed"
        setError(message)
      } finally {
        setLoadingId(null)
      }
    },
    [inc, refreshNavbar]
  )

  return { cancelStatus, loadingId, error }
}
