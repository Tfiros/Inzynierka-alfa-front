import { OfferService } from "@/shared/api/services/OfferService"
import { useAppStore } from "@/shared/store/appStore"
import type {
  ItemOfferDto,
  offerDraftRequest,
} from "@/shared/types/offerTypes/RequestResponseTypes"
import { useCallback, useMemo, useState } from "react"
import {
  addOfferLine,
  extractBackendMessage,
  removeOfferLine,
  setOfferLineQuantity,
  toOfferItemDto,
  validateOfferDraft,
  type OfferLine,
} from "../utils/OfferHelpers"

export const useCreateOffer = () => {
  const [itemsHave, setItemsHave] = useState<OfferLine[]>([])
  const [itemsWant, setItemsWant] = useState<OfferLine[]>([])
  const [isHighlighted, setIsHighlighted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [durationDays, setDurationDays] = useState<7 | 14 | 31>(7)
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [quoteIsLoading, setQuoteIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tokensOffered, setTokensOffered] = useState(0)
  const [tokensWanted, setTokensWanted] = useState(0)
  const inc = useAppStore((s) => s.inc)
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)

  const addHaveItem = useCallback((item: ItemOfferDto) => {
    setItemsHave((prev) => addOfferLine(prev, item))
  }, [])
  const addWantItem = useCallback((item: ItemOfferDto) => {
    setItemsWant((prev) => addOfferLine(prev, item))
  }, [])

  const removeAllHaveItem = useCallback((itemId: number) => {
    setItemsHave((prev) => removeOfferLine(prev, itemId))
  }, [])

  const removeAllWantItem = useCallback((itemId: number) => {
    setItemsWant((prev) => removeOfferLine(prev, itemId))
  }, [])

  const setHaveQuantity = useCallback(
    (item: ItemOfferDto, quantity: number) => {
      setItemsHave((prev) => setOfferLineQuantity(prev, item, quantity))
    },
    []
  )
  const setWantQuantity = useCallback(
    (item: ItemOfferDto, quantity: number) => {
      setItemsWant((prev) => setOfferLineQuantity(prev, item, quantity))
    },
    []
  )

  const buildOfferDraftRequest = useCallback<() => offerDraftRequest>(
    () => ({
      title: title.trim(),
      description: description.trim(),
      durationDays,
      offeredItems: toOfferItemDto(itemsHave),
      wantedItems: toOfferItemDto(itemsWant),
      isHighlighted,
      tokensOffered,
      tokensWanted,
    }),
    [
      title,
      description,
      durationDays,
      itemsHave,
      itemsWant,
      isHighlighted,
      tokensOffered,
      tokensWanted,
    ]
  )

  const offerCost = useMemo(() => {
    const durationFee = durationDays === 14 ? 30 : durationDays === 31 ? 60 : 0
    const highlightFee = isHighlighted ? 50 : 0
    const sum = [...itemsHave, ...itemsWant].reduce(
      (acc, x) => acc + x.item.estimatedTokenValue * x.quantity,
      0
    )
    const itemBase = Math.ceil(sum * 0.02)
    const tokenBase = Math.ceil((tokensOffered + tokensWanted) * 0.02)
    const baseCost = itemBase < 10 ? 10 + tokenBase : itemBase + tokenBase
    return baseCost + durationFee + highlightFee
  }, [
    itemsHave,
    itemsWant,
    isHighlighted,
    durationDays,
    tokensOffered,
    tokensWanted,
  ])

  const reset = useCallback(() => {
    setItemsHave([])
    setItemsWant([])
    setIsHighlighted(false)
    setError(null)
    setQuoteError(null)
    setTitle("")
    setDescription("")
    setDurationDays(7)
    setTokensOffered(0)
    setTokensWanted(0)
  }, [])

  const getServerQuote = useCallback(async (): Promise<number | null> => {
    const err = validateOfferDraft(title, description, itemsHave, itemsWant)
    if (err) {
      setQuoteError(err)
      return null
    }

    setQuoteError(null)
    setQuoteIsLoading(true)
    try {
      const res = await OfferService.offerQuote(buildOfferDraftRequest())
      if (!res.isSuccess || !res.data) {
        setQuoteError(res.message ?? "Nie udało się pobrać wycen z serwera")
        return null
      }
      return res.data.finalCost
    } catch (e) {
      setQuoteError(
        `Wystąpił błąd podczas pobierania wyceny: ${extractBackendMessage(e)}`
      )
      return null
    } finally {
      setQuoteIsLoading(false)
    }
  }, [buildOfferDraftRequest, title, description, itemsHave, itemsWant])

  const createOffer = useCallback(async (): Promise<boolean> => {
    if (isLoading) {
      setError("Trwa tworzenie oferty")
      return false
    }

    const err = validateOfferDraft(title, description, itemsHave, itemsWant)
    if (err) {
      setError(err)
      return false
    }

    setError(null)
    setIsLoading(true)
    try {
      const res = await OfferService.create(buildOfferDraftRequest())
      if (!res.isSuccess) {
        setError(res.message ?? "Nie udało się utworzyć oferty")
        return false
      }
      inc("offers:list")
      inc("offers:my")
      void refreshNavbar()
      return true
    } catch (e) {
      setError(
        `Wystąpił błąd podczas tworzenia oferty: ${extractBackendMessage(e)}`
      )
      return false
    } finally {
      setIsLoading(false)
    }
  }, [
    buildOfferDraftRequest,
    title,
    description,
    itemsHave,
    itemsWant,
    inc,
    refreshNavbar,
    isLoading,
  ])
  return {
    itemsHave,
    itemsWant,
    isHighlighted,
    setIsHighlighted,
    error,
    isLoading,
    addHaveItem,
    addWantItem,
    removeAllHaveItem,
    removeAllWantItem,
    setHaveQuantity,
    setWantQuantity,
    createOffer,
    offerCost,
    reset,
    durationDays,
    setDurationDays,
    getServerQuote,
    quoteError,
    quoteIsLoading,
    title,
    setTitle,
    description,
    setDescription,
    tokensOffered,
    setTokensOffered,
    tokensWanted,
    setTokensWanted,
  }
}
