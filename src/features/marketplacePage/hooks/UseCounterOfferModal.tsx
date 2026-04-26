import { useCallback, useEffect, useState } from "react"
import type { offerDetailsDtoResponse } from "@/shared/types/offerTypes/RequestResponseTypes"
import { OfferService } from "@/shared/api/services/OfferService"
import { useAppStore } from "@/shared/store/appStore"

export const useCounterOfferModal = () => {
  const open = useAppStore((s) => s.counterOfferOpen)
  const offerId = useAppStore((s) => s.counterOfferOfferId)
  const setOpen = useAppStore((s) => s.setCounterOfferOpen)
  const closeCounterOffer = useAppStore((s) => s.closeCounterOffer)

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
        return
      }

      setBaseOffer(res.data)
    } catch (e: unknown) {
      setBaseOffer(null)
      setBaseOfferError(
        e instanceof Error
          ? e.message
          : "Wystąpił błąd podczas pobierania oferty do kontroferty."
      )
    } finally {
      setBaseOfferLoading(false)
    }
  }, [])

  const resetBaseOffer = useCallback(() => {
    setBaseOffer(null)
    setBaseOfferError(null)
    setBaseOfferLoading(false)
  }, [])

  const close = useCallback(() => {
    closeCounterOffer()
    resetBaseOffer()
  }, [closeCounterOffer, resetBaseOffer])

  const onOpenChange = useCallback(
    (value: boolean) => {
      if (!value) {
        close()
        return
      }

      setOpen(true)
    },
    [close, setOpen]
  )

  useEffect(() => {
    if (!open || offerId == null) {
      resetBaseOffer()
      return
    }

    void fetchBaseOffer(offerId)
  }, [open, offerId, fetchBaseOffer, resetBaseOffer])

  return {
    open,
    offerId,
    close,
    onOpenChange,
    baseOffer,
    baseOfferLoading,
    baseOfferError,
  }
}
