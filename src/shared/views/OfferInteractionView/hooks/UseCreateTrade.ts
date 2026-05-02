import { useState } from "react"
import { TradeService } from "@/shared/api/services/TradeService"
import { useAppStore } from "@/shared/store/appStore"

export const useCreateTrade = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentUserId = useAppStore((s) => s.userId)
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)
  const inc = useAppStore((s) => s.inc)

  const createTrade = async (offerId: number) => {
    if (!currentUserId) {
      setError("Musisz być zalogowany.")
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const res = await TradeService.create({
        offerId,
        customerId: currentUserId,
        counterOfferId: null,
      })

      if (!res.isSuccess) {
        setError(res.message ?? "Nie udało się utworzyć wymiany.")
        return false
      }

      inc("offers:list")
      inc("offers:my")
      inc("trades")
      void refreshNavbar()

      return true
    } catch {
      setError("Nie udało się utworzyć wymiany.")
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    createTrade,
    loading,
    error,
  }
}
