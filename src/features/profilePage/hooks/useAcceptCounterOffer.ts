import { CounterOfferService } from "@/shared/api/services/CounterOfferService"
import type { AcceptedOfferResponseType } from "@/shared/types/counterOfferTypes/AcceptedOfferResponseType"
import { useCallback, useState } from "react"

export function useAcceptCounterOffer() {
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const accept = useCallback(async (counterOfferId: number) => {
    setLoadingId(counterOfferId)
    setError(null)

    try {
      const res = await CounterOfferService.accept(counterOfferId)

      if (!res.isSuccess) {
        setError(res.message ?? "Akceptacja nieudana")
        return {
          ok: false as const,
          data: null as AcceptedOfferResponseType | null,
        }
      }

      return {
        ok: true as const,
        data: res.data ?? null,
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Request failed"

      setError(message)

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
