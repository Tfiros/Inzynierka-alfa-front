import { OfferService } from "@/shared/api/services/OfferService"
import { useDebounceValue } from "@/shared/hooks/UseDebounceValue"
import type { ItemOfferDto } from "@/shared/types/offerTypes/RequestResponseTypes"
import { useCallback, useEffect, useRef, useState } from "react"

export const useItemSuggestions = () => {
  const [query, setQuery] = useState("")

  const minChars = 3
  const debounceQuery = useDebounceValue(query)

  const [suggestions, setSuggestions] = useState<ItemOfferDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reqIdRef = useRef(0)

  const fetchSuggestions = useCallback(async (qRaw: string) => {
    const q = qRaw.trim()
    setLoading(true)
    setError(null)

    const currentReqId = ++reqIdRef.current

    try {
      const res = await OfferService.getSuggestedItemByQuery(q)
      if (currentReqId !== reqIdRef.current) return
      if (!res.isSuccess || !res.data) {
        setError(res.message ?? "Nie udało się pobrać sugestii")
        setSuggestions([])
        return
      }
      const items: ItemOfferDto[] = res.data ?? []
      setSuggestions(items)
    } catch {
      if (currentReqId !== reqIdRef.current) return
      setError("Wystąpił błąd podczas pobierania sugestii.")
      setSuggestions([])
    } finally {
      if (currentReqId !== reqIdRef.current) return
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceQuery.trim().length < minChars) {
      reqIdRef.current += 1
      setSuggestions([])
      setLoading(false)
      setError(null)
      return
    }
    void fetchSuggestions(debounceQuery)
  }, [debounceQuery, minChars, fetchSuggestions])
  return {
    query,
    setQuery,
    suggestions,
    loading,
    error,
  }
}
