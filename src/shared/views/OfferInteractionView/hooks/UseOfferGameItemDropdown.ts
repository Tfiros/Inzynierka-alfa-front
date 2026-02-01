import { OfferService } from "@/shared/api/services/OfferService"
import type {
  GameOfferDTO,
  ItemOfferDto,
} from "@/shared/types/offerTypes/RequestResponseTypes"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDebounceValue } from "./UseDebounceValue"

export const useOfferGameItemDropdown = () => {
  const minChars = 3
  const [games, setGames] = useState<GameOfferDTO[]>([])
  const [gamesLoading, setGamesLoading] = useState(false)
  const [gamesError, setGamesError] = useState<string | null>(null)
  const [gameId, setGameId] = useState<number | null>(null)
  const [query, setQuery] = useState("")
  const debounced = useDebounceValue(query)
  const [items, setItems] = useState<ItemOfferDto[]>([])
  const [itemsLoading, setItemsLoading] = useState(false)
  const [itemsError, setItemsError] = useState<string | null>(null)
  const reqIdRef = useRef(0)

  const setGame = useCallback((id: number | null) => {
    setGameId(id)
    setQuery("")
  }, [])

  useEffect(() => {
    let alive = true
    const loadGames = async () => {
      setGamesLoading(true)
      setGamesError(null)

      try {
        const res = await OfferService.getGames()
        if (!alive) return
        if (!res.isSuccess || !res.data) {
          setGamesError(res.message ?? "Nie udało się pobrać gier")
          setGames([])
          return
        }
        setGames(res.data)
      } catch {
        if (!alive) return
        setGamesError("Błąd poczas pobierania gier")
        setGames([])
      } finally {
        if (!alive) return
        setGamesLoading(false)
      }
    }
    void loadGames()
    return () => {
      alive = false
    }
  }, [])

  const fetchItems = useCallback(
    async (qRaw: string, fetchGameId: number) => {
      const q = qRaw.trim()

      if (q.length < minChars) {
        reqIdRef.current += 1
        setItems([])
        setItemsLoading(false)
        setItemsError(null)
        return
      }

      const current = ++reqIdRef.current

      setItemsLoading(true)
      setItemsError(null)

      try {
        const res = await OfferService.getSuggestedItemByQueryAndGame(
          q,
          fetchGameId
        )
        if (current !== reqIdRef.current) return
        if (!res.isSuccess || !res.data) {
          setItemsError(res.message ?? "Nie udało się pobrać przedmiotów")
          setItems([])
          return
        }
        setItems(res.data)
      } catch {
        if (current !== reqIdRef.current) {
          return
        }
        setItemsError("Błąd podczas pobierania przedmiotów")
        setItems([])
      } finally {
        if (current !== reqIdRef.current) {
          return
        }
        setItemsLoading(false)
      }
    },
    [minChars]
  )

  useEffect(() => {
    const q = debounced.trim()

    if (!gameId || q.length < minChars) {
      reqIdRef.current += 1
      setItems([])
      setItemsLoading(false)
      setItemsError(null)
      return
    }
    void fetchItems(q, gameId)
  }, [debounced, minChars, gameId, fetchItems])

  const reset = useCallback(() => {
    setGameId(null)
    setQuery("")
    reqIdRef.current += 1
    setItems([])
    setItemsLoading(false)
    setItemsError(null)
  }, [])

  return {
    games,
    gamesLoading,
    gamesError,
    gameId,
    setGame,
    query,
    setQuery,
    items,
    itemsLoading,
    itemsError,
    reset,
  }
}
