import { useEffect, useState } from "react"
import type { offerDetailsDtoResponse } from "@/shared/types/offerTypes/RequestResponseTypes"
import { OfferService } from "@/shared/api/services/OfferService"

export const useAcceptOfferModal = (offerId: number | null) => {
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
      setBaseOffer(null)
      setBaseOfferLoading(true)
      setBaseOfferError(null)

      try {
        const res = await OfferService.getDetails(offerId)

        if (!alive) return

        if (!res.isSuccess || !res.data) {
          setBaseOffer(null)
          setBaseOfferError(
            res.message ?? "Wystąpił błąd podczas pobierania oferty."
          )
          return
        }

        setBaseOffer(res.data)
      } catch {
        if (!alive) return
        setBaseOffer(null)
        setBaseOfferError("Wystąpił błąd podczas pobierania oferty.")
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
