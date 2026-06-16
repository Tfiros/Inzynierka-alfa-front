import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { CounterOfferService } from "@/shared/api/services/CounterOfferService"
import { useAppStore } from "@/shared/store/appStore"
import type { CounterOfferDraftRequest } from "@/shared/types/counterOfferTypes/RequestResponseTypes"
import type {
  ItemOfferDto,
  offerDetailsDtoResponse,
} from "@/shared/types/offerTypes/RequestResponseTypes"
import {
  addOfferLine,
  removeOfferLine,
  setOfferLineQuantity,
  type OfferLine,
} from "@/shared/views/OfferInteractionView/utils/OfferHelpers"

type UseCreateCounterOfferProps = {
  offerId: number | null
  baseOffer: offerDetailsDtoResponse | null
  onSuccess: () => void
}

export const useCreateCounterOffer = ({
  offerId,
  baseOffer,
  onSuccess,
}: UseCreateCounterOfferProps) => {
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)
  const inc = useAppStore((s) => s.inc)
  const userTokens = useAppStore((s) => s.navbarUser?.tokens ?? 0)

  const [items, setItems] = useState<OfferLine[]>([])
  const [tokens, setTokens] = useState(0)

  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [serverCost, setServerCost] = useState<number | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState<string | null>(null)

  const COUNTER_OFFER_CREATION_FEE = 20

  const estimatedCost = useMemo(() => COUNTER_OFFER_CREATION_FEE, [])

  const counterOfferTokens = tokens
  const offerTokenCost = serverCost ?? estimatedCost
  const totalTokensNeeded = offerTokenCost + counterOfferTokens

  const hasNotEnoughTokens = totalTokensNeeded > userTokens

  const baseOfferTokens = baseOffer?.offerCoreDto.tokensOffered ?? 0

  const isIllegalTokenForTokenCounterOffer =
    baseOffer != null &&
    baseOffer.offeredItems.length === 0 &&
    baseOfferTokens > 0 &&
    items.length === 0 &&
    counterOfferTokens > 0

  const canConfirm =
    (items.length > 0 || tokens > 0) &&
    tokens >= 0 &&
    !submitting &&
    !hasNotEnoughTokens &&
    !isIllegalTokenForTokenCounterOffer

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

  const buildRequest = (): CounterOfferDraftRequest => ({
    tokensOffered: tokens,
    items: items.map((i) => ({
      itemId: i.item.id,
      quantity: i.quantity,
    })),
  })

  const openConfirm = async () => {
    if (!offerId) return false
    if (hasNotEnoughTokens || isIllegalTokenForTokenCounterOffer) return false

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
    if (hasNotEnoughTokens || isIllegalTokenForTokenCounterOffer) return false

    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await CounterOfferService.create(offerId, buildRequest())

      if (!res.isSuccess) {
        setSubmitError(res.message || "Nie udało się wysłać kontroferty.")
        return false
      }

      toast.success("Kontroferta została wysłana.")

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
    tokens,
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

    userTokens,
    baseOfferTokens,
    totalTokensNeeded,
    hasNotEnoughTokens,
    isIllegalTokenForTokenCounterOffer,
  }
}
