import api from "@/shared/api/Api"
import type { AcceptedOfferResponseType } from "@/shared/types/counterOfferTypes/AcceptedOfferResponseType"
import { useCallback, useState } from "react"

export function useAcceptCounterOffer() {
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const accept = useCallback(async (counterOfferId: number) => {
    setLoadingId(counterOfferId)
    setError(null)

    try {
      const res = await api.post(`/CounterOffers/${counterOfferId}/accept`)

      if (!res.data?.isSuccess) {
        setError(res.data?.message ?? "Akceptacja nie udana")
        return {
          ok: false as const,
          data: null as AcceptedOfferResponseType | null,
        }
      }

      return {
        ok: true as const,
        data: res.data.data as AcceptedOfferResponseType,
      }
    } catch (e: any) {
      setError(e?.message ?? "Request failed")
      return {
        ok: false as const,
        data: null as AcceptedOfferResponseType | null,
      }
    } finally {
      setLoadingId(null)
    }
  }, [])

  return { accept, loadingId, error }
}
