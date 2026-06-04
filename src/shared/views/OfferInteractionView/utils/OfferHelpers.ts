import type { offerItemDto } from "@/shared/types/offerTypes/OfferTypes"
import type { ItemOfferDto } from "@/shared/types/offerTypes/RequestResponseTypes"

export const MIN_TITLE_LEN = 3
export const MIN_DESCRIPTION_LEN = 3

export type OfferLine = { item: ItemOfferDto; quantity: number }

export const toOfferItemDto = (lines: OfferLine[]): offerItemDto[] => {
  const offerItemDtos = lines.map((x) => ({
    itemId: x.item.id,
    quantity: x.quantity,
  }))
  return offerItemDtos
}

export const addOfferLine = (
  prev: OfferLine[],
  item: ItemOfferDto
): OfferLine[] => {
  if (prev.some((x) => x.item.id === item.id)) {
    return prev
  }
  return [...prev, { item, quantity: 1 }]
}

export const removeOfferLine = (
  prev: OfferLine[],
  itemId: number
): OfferLine[] => {
  return prev.filter((x) => x.item.id !== itemId)
}

export const setOfferLineQuantity = (
  prev: OfferLine[],
  item: ItemOfferDto,
  quantity: number
): OfferLine[] => {
  const id = prev.findIndex((x) => x.item.id === item.id)
  const q = Math.max(0, Math.floor(quantity))

  if (q === 0) {
    return id === -1 ? prev : prev.filter((x) => x.item.id !== item.id)
  }

  if (id === -1) {
    return [...prev, { item, quantity: q }]
  }

  const next = prev.slice()
  next[id] = { item, quantity: q }
  return next
}

export const validateOfferDraft = (
  title: string,
  description: string,
  itemsHave: OfferLine[],
  itemsWant: OfferLine[],
  tokensOffered: number,
  tokensWanted: number
): string | null => {
  if (title.trim().length < MIN_TITLE_LEN) {
    return `Tytuł musi mieć co najmniej ${MIN_TITLE_LEN} znaki`
  }
  if (description.trim().length < MIN_DESCRIPTION_LEN) {
    return `Opis musi mieć co najmniej ${MIN_DESCRIPTION_LEN} znaki`
  }
  if (itemsHave.length === 0 && itemsWant.length === 0) {
    return "Przynajmniej jedna strona musi zawierać przedmioty"
  }
  if (itemsHave.length === 0 && tokensOffered <= 0) {
    return "Dodaj przedmioty lub tokeny w 'Co oferujesz'"
  }
  if (itemsWant.length === 0 && tokensWanted <= 0) {
    return "Dodaj przedmioty lub tokeny w 'Czego szukasz'"
  }
  return null
}

export const extractBackendMessage = (e: unknown): string =>
  typeof e === "object" && e !== null && "message" in e
    ? String((e as { message?: unknown }).message ?? "unknown")
    : "unknown"
