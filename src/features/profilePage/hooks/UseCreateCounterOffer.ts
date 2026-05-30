import { useEffect, useMemo, useState } from "react"
import { CounterOfferService } from "@/shared/api/services/CounterOfferService"
import { useAppStore } from "@/shared/store/appStore"
import type { CounterOfferDraftRequest } from "@/shared/types/counterOfferTypes/RequestResponseTypes"
import type { ItemOfferDto } from "@/shared/types/offerTypes/RequestResponseTypes"
import {
  addOfferLine,
  removeOfferLine,
  setOfferLineQuantity,
  type OfferLine,
} from "@/shared/views/OfferInteractionView/utils/OfferHelpers"

type UseCreateCounterOfferProps = {
  offerId: number | null
  onSuccess: () => void
}

export const useCreateCounterOffer = ({
  offerId,
  onSuccess,
}: UseCreateCounterOfferProps) => {
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)
  const inc = useAppStore((s) => s.inc)

  const [items, setItems] = useState<OfferLine[]>([])
  const [tokens, setTokens] = useState(0)

  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [serverCost, setServerCost] = useState<number | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState<string | null>(null)

  useEffect(() => {
    setSubmitError(null)
  }, [tokens, items])

  const addItem = (item: ItemOfferDto) => {
    setItems((previousItems) => addOfferLine(previousItems, item))
  }

  const setQuantity = (item: ItemOfferDto, quantity: number) => {
    setItems((previousItems) =>
      setOfferLineQuantity(previousItems, item, quantity)
    )
  }

  const removeItem = (itemId: number) => {
    setItems((previousItems) => removeOfferLine(previousItems, itemId))
  }

  const canConfirm =
    (items.length > 0 || tokens > 0) && tokens >= 0 && !submitting
  const COUNTER_OFFER_CREATION_FEE = 20
  const estimatedCost = useMemo(() => COUNTER_OFFER_CREATION_FEE, [])

  const buildRequest = (): CounterOfferDraftRequest => ({
    tokensOffered: tokens,
    items: items.map((i) => ({
      itemId: i.item.id,
      quantity: i.quantity,
    })),
  })

  const openConfirm = async () => {
    if (!offerId) return false

    setQuoteLoading(true)
    setQuoteError(null)
    setSubmitError(null)

    try {
      const res = await CounterOfferService.quote(offerId, buildRequest())

      if (!res.isSuccess || !res.data) {
        setQuoteError(res.message || "Nie udało się pobrać wyceny kontroferty.")
        return false
      }

      setServerCost(res.data.totalCost)
      return true
    } catch {
      setQuoteError("Nie udało się pobrać wyceny kontroferty.")
      return false
    } finally {
      setQuoteLoading(false)
    }
  }

  const submit = async () => {
    if (!offerId) return false

    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await CounterOfferService.create(offerId, buildRequest())

      if (!res.isSuccess) {
        setSubmitError(res.message || "Nie udało się wysłać kontroferty.")
        return false
      }

      inc("counterOffers:sent")
      void refreshNavbar()
      onSuccess()
      return true
    } catch {
      setSubmitError("Nie udało się wysłać kontroferty.")
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const summaryText = useMemo(() => {
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0)
    return `${items.length} przedmiotów, łączna liczba sztuk: ${itemsCount}, tokeny: ${tokens}`
  }, [items, tokens])

  return {
    items,
    setTokens,
    submitError,
    submitting,
    quoteLoading,
    serverCost,
    quoteError,
    canConfirm,
    estimatedCost,
    summaryText,
    addItem,
    setQuantity,
    removeItem,
    openConfirm,
    submit,
  }
}
