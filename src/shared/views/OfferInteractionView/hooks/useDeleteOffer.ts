import { OfferService } from "@/shared/api/services/OfferService"
import { useAppStore } from "@/shared/store/AppStore"
import { useCallback, useState } from "react"

export const useDeleteOffer = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inc = useAppStore((s) => s.inc)
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)

  const reset = useCallback(() => {
    setError(null)
  }, [])

  const deleteOffer = useCallback(
    async (offerId: number): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await OfferService.cancel(offerId)
        if (!res.isSuccess) {
          setError(res.message ?? "Nie udało się usunąć oferty")
          return false
        }
        inc("offers:list")
        inc("offers:my")
        void refreshNavbar()
        return true
      } catch {
        setError("Wystąpił błąd przy usuwaniu oferty")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [inc, refreshNavbar]
  )
  return { isLoading, error, reset, deleteOffer }
}
