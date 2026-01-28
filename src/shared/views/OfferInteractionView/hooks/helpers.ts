import type { offerItemDto } from "@/shared/types/offerTypes/OfferTypes"
import type { ItemOfferDto } from "@/shared/types/offerTypes/RequestResponseTypes"
import { useEffect, useState } from "react"

export type OfferLine = { item: ItemOfferDto; quantity: number }

export const toOfferItemDto = (lines: OfferLine[]): offerItemDto[] => {
  const offerItemDtos = lines.map((x) => ({
    itemId: x.item.id,
    quantity: x.quantity,
  }))
  return offerItemDtos
}

export const useDebounceValue = <T>(value: T, delay = 300): T => {
  const [debouncedValue, setDebounceValue] = useState<T>(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounceValue(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debouncedValue
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
  itemsWant: OfferLine[]
): string | null => {
  if (!title.trim()) {
    return "Podaj tytuł"
  }
  if (!description.trim()) {
    return "Podaj opis"
  }
  if (itemsHave.length === 0) {
    return "Wymagane przedmioty w 'Co oferujesz'"
  }
  if (itemsWant.length === 0) {
    return "Wymagane przedmioty w 'Czego szukasz'"
  }
  return null
}
