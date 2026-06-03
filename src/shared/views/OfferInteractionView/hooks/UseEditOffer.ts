import { OfferService } from "@/shared/api/services/OfferService"
import { useAppStore } from "@/shared/store/appStore"
import type { offerListingItemDto } from "@/shared/types/offerTypes/OfferTypes"
import {
  type ItemOfferDto,
  type offerUpdateDraftRequest,
  type offerUpdateQuoteResponse,
} from "@/shared/types/offerTypes/RequestResponseTypes"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  addOfferLine,
  extractBackendMessage,
  removeOfferLine,
  setOfferLineQuantity,
  toOfferItemDto,
  validateOfferDraft,
  type OfferLine,
} from "../utils/OfferHelpers"

export const useEditOffer = (offerId: number | null) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isHighlighted, setIsHighlighted] = useState(false)
  const [durationDays, setDurationDays] = useState<0 | 7 | 14 | 31>(0)
  const inc = useAppStore((s) => s.inc)
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)
  const [originalTokenCost, setOriginalTokenCost] = useState<number | null>(
    null
  )
  const [itemsHave, setItemsHave] = useState<OfferLine[]>([])
  const [itemsWant, setItemsWant] = useState<OfferLine[]>([])
  const [quoteIsLoading, setQuoteIsLoading] = useState(false)
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [quote, setQuote] = useState<offerUpdateQuoteResponse | null>(null)
  const [tokensOffered, setTokensOffered] = useState(0)
  const [tokensWanted, setTokensWanted] = useState(0)

  const reset = useCallback(() => {
    setError(null)
    setTitle("")
    setDescription("")
    setIsHighlighted(false)
    setDurationDays(0)
    setItemsHave([])
    setItemsWant([])
    setQuote(null)
    setQuoteError(null)
    setTokensOffered(0)
    setTokensWanted(0)
    setOriginalTokenCost(null)
  }, [])
  useEffect(() => {
    setQuote(null)
    setQuoteError(null)
  }, [
    title,
    description,
    isHighlighted,
    durationDays,
    itemsHave,
    itemsWant,
    tokensOffered,
    tokensWanted,
  ])

  useEffect(() => {
    if (!offerId) {
      reset()
      return
    }
    let alive = true
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await OfferService.getDetails(offerId)
        if (!alive) return
        if (!res.isSuccess || !res.data) {
          setError(res.message ?? "Wystąpił błąd przy ładowaniu oferty")
          return
        }
        const data = res.data
        setOriginalTokenCost(data.offerCoreDto.tokenCost)
        setTitle(data.offerCoreDto.title)
        setDescription(data.offerCoreDto.description)
        setIsHighlighted(data.offerCoreDto.isHighlighted)
        setDurationDays(0)
        setItemsHave(data.offeredItems.map(toOfferLine))
        setItemsWant(data.wantedItems.map(toOfferLine))
        setTokensOffered(data.offerCoreDto.tokensOffered)
        setTokensWanted(data.offerCoreDto.tokensWanted)
        setQuote(null)
        setQuoteError(null)
      } catch {
        if (!alive) return
        setError("Wystąpił błąd przy ładowaniu oferty")
      } finally {
        if (alive) setIsLoading(false)
      }
    }
    void load()
    return () => {
      alive = false
    }
  }, [offerId, reset])

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

  const buildUpdateRequest = useCallback<() => offerUpdateDraftRequest>(
    () => ({
      title: title.trim(),
      description: description.trim(),
      durationDays,
      isHighlighted,
      offeredItems: toOfferItemDto(itemsHave),
      wantedItems: toOfferItemDto(itemsWant),
      tokensOffered,
      tokensWanted,
    }),
    [
      title,
      description,
      durationDays,
      isHighlighted,
      itemsHave,
      itemsWant,
      tokensOffered,
      tokensWanted,
    ]
  )

  const getServerQuote =
    useCallback(async (): Promise<offerUpdateQuoteResponse | null> => {
      if (!offerId) return null
      const err = validateOfferDraft(title, description, itemsHave, itemsWant)
      if (err) {
        setQuoteError(err)
        return null
      }
      setQuoteError(null)
      setQuoteIsLoading(true)
      try {
        const res = await OfferService.offerUpdateQuote(
          offerId,
          buildUpdateRequest()
        )
        if (!res.isSuccess || !res.data) {
          setQuoteError(res.message ?? "Nie udało się pozyskać kosztu oferty")
          return null
        }
        setQuote(res.data)
        return res.data
      } catch (e) {
        setQuoteError(
          `Wystąpił błąd podczas pobierania wyceny: ${extractBackendMessage(e)}`
        )
        return null
      } finally {
        setQuoteIsLoading(false)
      }
    }, [offerId, title, description, itemsHave, itemsWant, buildUpdateRequest])
  const newTotalPreview = useMemo(() => {
    const durationFee = durationDays === 14 ? 30 : durationDays === 31 ? 60 : 0
    const highlighFee = isHighlighted ? 50 : 0
    const itemSum = [...itemsHave, ...itemsWant].reduce(
      (acc, x) => acc + x.item.estimatedTokenValue * x.quantity,
      0
    )
    const itemBase = Math.ceil(itemSum * 0.02)
    const tokenBase = Math.ceil((tokensOffered + tokensWanted) * 0.02)
    const baseCost = itemBase < 10 ? 10 + tokenBase : itemBase + tokenBase
    return baseCost + durationFee + highlighFee
  }, [
    itemsHave,
    itemsWant,
    durationDays,
    isHighlighted,
    tokensOffered,
    tokensWanted,
  ])

  const updateFeePreview = useMemo(() => {
    if (originalTokenCost == null) return null
    return Math.max(10, newTotalPreview - originalTokenCost)
  }, [newTotalPreview, originalTokenCost])

  const updateOffer = useCallback(async () => {
    if (!offerId) return false

    const err = validateOfferDraft(title, description, itemsHave, itemsWant)
    if (err) {
      setError(err)
      return false
    }

    setError(null)
    setIsLoading(true)
    try {
      const res = await OfferService.update(offerId, buildUpdateRequest())
      if (!res.isSuccess || !res.data) {
        setError(res.message ?? "Nie udało się zaktualizoweać oferty")
        return false
      }
      inc("offers:list")
      inc("offers:my")
      void refreshNavbar()
      return true
    } catch (e) {
      setError(
        `Wystąpił błąd podczas aktualizacji oferty: ${extractBackendMessage(e)}`
      )
      return false
    } finally {
      setIsLoading(false)
    }
  }, [offerId, buildUpdateRequest, inc, refreshNavbar])
  const canSubmit =
    !isLoading &&
    !quoteIsLoading &&
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    itemsHave.length > 0 &&
    itemsWant.length > 0

  return {
    isLoading,
    error,
    title,
    setTitle,
    description,
    setDescription,
    isHighlighted,
    setIsHighlighted,
    durationDays,
    setDurationDays,
    updateFeePreview,
    itemsHave,
    itemsWant,
    addHaveItem,
    addWantItem,
    setHaveQuantity,
    setWantQuantity,
    removeAllHaveItem,
    removeAllWantItem,
    quote,
    quoteIsLoading,
    quoteError,
    getServerQuote,
    updateOffer,
    canSubmit,
    tokensOffered,
    setTokensOffered,
    tokensWanted,
    setTokensWanted,
    reset,
  }
}

const toOfferLine = (x: offerListingItemDto): OfferLine => ({
  item: {
    id: x.itemDto.id,
    name: x.itemDto.name,
    photoUrl: x.itemDto.photoUrl,
    estimatedTokenValue: x.itemDto.estimatedTokenValue,
    game: {
      id: x.itemDto.game.id,
      name: x.itemDto.game.name,
      photoUrl: x.itemDto.game.photoUrl,
      genreId: x.genreId,
    },
  },
  quantity: x.quantity,
})
