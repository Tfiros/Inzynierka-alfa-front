import { OfferService } from "@/shared/api/services/OfferService"
import { useCallback, useState } from "react"
import type { OfferInformationDTO } from "@/shared/types/offerTypes/RequestResponseTypes"

export const useCreateCounterOffer = () => {
  const [data, setData] = useState<OfferInformationDTO | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchOffer = useCallback(async (offerId: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await OfferService.getCounterInfo(offerId)
      if (!res.isSuccess || !res.data) {
        setData(null)
        setError(res.message ?? "Nie udało się pobrać oferty do kontroferty")
        return null
      }

      setData(res.data)
      return res.data
    } catch {
      setData(null)
      setError("Wystąpił błąd podczas pobierania oferty do kontroferty.")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return { data, error, isLoading, fetchOffer, reset }
}
