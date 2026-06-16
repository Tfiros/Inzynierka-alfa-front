import { useEffect, useState, useCallback } from "react"
import { CounterOfferService } from "@/shared/api/services/CounterOfferService"
import type { CounterOfferListItemDto } from "@/shared/types/counterOfferTypes/CounterOfferListItemDto"

export const useOfferCounterOffers = (offerId: number, enabled: boolean) => {
  const [data, setData] = useState<CounterOfferListItemDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!enabled || offerId <= 0) {
      setData([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await CounterOfferService.getForOffer(offerId)

      if (!res.isSuccess || !res.data) {
        setData([])
        setError(res.message ?? "Nie udało się pobrać kontrofert.")
        return
      }

      setData(res.data)
    } catch {
      setData([])
      setError("Nie udało się pobrać kontrofert.")
    } finally {
      setLoading(false)
    }
  }, [offerId, enabled])

  useEffect(() => {
    void load()
  }, [load])

  return {
    data,
    loading,
    error,
    reload: load,
  }
}
