import { useEffect, useState } from "react"
import type { offerDetailsDtoResponse } from "@/shared/types/offerTypes/RequestResponseTypes"
import { OfferService } from "@/shared/api/services/OfferService"

export const useCounterOfferModal = (offerId: number | null) => {
  const [baseOffer, setBaseOffer] = useState<offerDetailsDtoResponse | null>(
    null
  )
  const [baseOfferError, setBaseOfferError] = useState<string | null>(null)
  const [baseOfferLoading, setBaseOfferLoading] = useState(false)

  useEffect(() => {
    if (offerId == null) {
      setBaseOffer(null)
      setBaseOfferError(null)
      setBaseOfferLoading(false)
      return
    }
    let alive = true
    const load = async () => {
      setBaseOfferLoading(true)
      setBaseOfferError(null)

      try {
        const res = await OfferService.getDetails(offerId)

        if (!alive) {
          return
        }

        if (!res.isSuccess || !res.data) {
          setBaseOffer(null)
          setBaseOfferError(
            res.message ??
              "Wystąpił błąd podczas pobierania oferty do kontroferty."
          )
          return
        }
        setBaseOffer(res.data)
      } catch {
        if (!alive) {
          return
        }
        setBaseOfferError("Wystąpił błąd przy pobieraniu oferty")
      } finally {
        if (alive) {
          setBaseOfferLoading(false)
        }
      }
    }
    void load()
    return () => {
      alive = false
    }
  }, [offerId])

  return {
    baseOffer,
    baseOfferLoading,
    baseOfferError,
  }
}
