import { OfferService } from "@/shared/api/services/OfferService"
import type { offerDetailsDtoResponse } from "@/shared/types/offerTypes/RequestResponseTypes"
import { useEffect, useState } from "react"

export function useOfferDetails(offerId: number | null, enabled: boolean) {
  const [offerDetails, setOfferDetails] =
    useState<offerDetailsDtoResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !offerId) return
    let alive = true
    const load = async () => {
      setLoading(true)
      setError(null)

      const res = await OfferService.getDetails(offerId)
      if (!alive) return
      setLoading(false)

      if (!res.isSuccess || !res.data) {
        setError(res.message ?? "Unknown error")
        setOfferDetails(null)
        return
      }
      setOfferDetails(res.data)
    }
    void load()
    return () => {
      alive = false
    }
  }, [offerId, enabled])

  return {
    offerDetails,
    loading,
    error,
  }
}
