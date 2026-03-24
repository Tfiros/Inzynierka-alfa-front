import { useCallback, useState } from "react"
import type { offerDetailsDtoResponse } from "@/shared/types/offerTypes/RequestResponseTypes"
import { OfferService } from "@/shared/api/services/OfferService"

export const useCounterOfferModal = () => {
  const [open, setOpen] = useState(false)
  const [offerId, setOfferId] = useState<number | null>(null)

  const [baseOffer, setBaseOffer] = useState<offerDetailsDtoResponse | null>(
    null
  )
  const [baseOfferError, setBaseOfferError] = useState<string | null>(null)
  const [baseOfferLoading, setBaseOfferLoading] = useState(false)

  const fetchBaseOffer = useCallback(async (id: number) => {
    setBaseOfferLoading(true)
    setBaseOfferError(null)

    try {
      const res = await OfferService.getDetails(id)

      if (!res.isSuccess || !res.data) {
        setBaseOffer(null)
        setBaseOfferError(
          res.message ?? "Nie udało się pobrać oferty do kontroferty."
        )
        return null
      }

      setBaseOffer(res.data)
      return res.data
    } catch (e: unknown) {
      setBaseOffer(null)
      setBaseOfferError(
        e instanceof Error
          ? e.message
          : "Wystąpił błąd podczas pobierania oferty do kontroferty."
      )
      return null
    } finally {
      setBaseOfferLoading(false)
    }
  }, [])

  const openForOffer = useCallback(
    async (id: number) => {
      setOfferId(id)
      setOpen(true)
      await fetchBaseOffer(id)
    },
    [fetchBaseOffer]
  )

  const reset = useCallback(() => {
    setOfferId(null)
    setBaseOffer(null)
    setBaseOfferError(null)
    setBaseOfferLoading(false)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    reset()
  }, [reset])

  const onOpenChange = useCallback(
    (value: boolean) => {
      if (!value) close()
      else setOpen(true)
    },
    [close]
  )

  return {
    open,
    offerId,
    openForOffer,
    close,
    onOpenChange,
    baseOffer,
    baseOfferLoading,
    baseOfferError,
    refetchBaseOffer: offerId ? () => fetchBaseOffer(offerId) : undefined,
  }
}
