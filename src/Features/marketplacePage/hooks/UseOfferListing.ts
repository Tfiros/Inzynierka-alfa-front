import { OfferService } from "@/shared/api/services/OfferService"
import { selectCounter, useAppStore } from "@/shared/store/appStore"
import { offerOrderBy } from "@/shared/types/offerTypes/OfferTypes"
import type {
  GameOfferDTO,
  GenreOfferDTO,
  offerListingDtoResponse,
  offerListingQueryRequest,
  RarityOfferDTO,
} from "@/shared/types/offerTypes/RequestResponseTypes"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debouncedValue
}

export function useOffersListing() {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [offers, setOffers] = useState<offerListingDtoResponse[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>(0)

  const [searchText, setSearchText] = useState<string>("")
  const debouncedSearchText = useDebouncedValue<string>(searchText, 300)
  const [orderBy, setOrderBy] = useState<offerOrderBy>(offerOrderBy.newest)

  const [gameId, setGameId] = useState<number | undefined>(undefined)
  const [genreId, setGenreId] = useState<number | undefined>(undefined)
  const [rarityId, setRarityId] = useState<number | undefined>(undefined)

  const [games, setGames] = useState<GameOfferDTO[]>([])
  const [genres, setGenres] = useState<GenreOfferDTO[]>([])
  const [rarities, setRarities] = useState<RarityOfferDTO[]>([])

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const offersRefresh = useAppStore(selectCounter("offers:list"))

  useEffect(() => {
    OfferService.getGames().then((res) => {
      if (res.isSuccess && res.data) {
        setGames(res.data)
      }
    })
    OfferService.getGenres().then((res) => {
      if (res.isSuccess && res.data) {
        setGenres(res.data)
      }
    })
  }, [])

  const filteredGames = useMemo(() => {
    if (genreId === undefined) return games
    return games.filter((g) => g.genreId === genreId)
  }, [games, genreId])

  const handleGameChange = useCallback(
    (newGameId: number | undefined) => {
      setGameId(newGameId)
      if (newGameId !== undefined) {
        const game = games.find((g) => g.id === newGameId)
        if (game) {
          setGenreId(game.genreId)
        }
      }
    },
    [games]
  )

  const handleGenreChange = useCallback(
    (newGenreId: number | undefined) => {
      setGenreId(newGenreId)
      if (newGenreId !== undefined && gameId !== undefined) {
        const game = games.find((g) => g.id === gameId)
        if (game && game.genreId !== newGenreId) {
          setGameId(undefined)
        }
      }
      if (newGenreId === undefined) {
        setGameId(undefined)
      }
    },
    [games, gameId]
  )

  const prevGameId = useRef(gameId)
  useEffect(() => {
    if (prevGameId.current !== gameId) {
      setRarityId(undefined)
      prevGameId.current = gameId
    }

    if (gameId === undefined) {
      setRarities([])
      return
    }
    OfferService.getRarities(gameId).then((res) => {
      if (res.isSuccess && res.data) {
        setRarities(res.data)
      }
    })
  }, [gameId])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchText, orderBy, pageSize, gameId, genreId, rarityId])

  const query: offerListingQueryRequest = useMemo(
    () => ({
      page,
      pageSize,
      searchText: debouncedSearchText || undefined,
      orderBy,
      gameId,
      genreId,
      rarityId,
    }),
    [page, pageSize, debouncedSearchText, orderBy, gameId, genreId, rarityId]
  )

  useEffect(() => {
    let alive = true
    const load = async () => {
      setLoading(true)
      setError(null)

      const res = await OfferService.getPaged(query)
      if (!alive) return
      setLoading(false)

      if (!res.isSuccess || !res.data) {
        setError(res.message ?? "Unknown error")
        return
      }
      setOffers(res.data.elements)
      setTotalPages(res.data.totalPages)
      setTotalCount(res.data.totalCount)
      setPage(res.data.page)
      setPageSize(res.data.pageSize)
    }
    void load()
    return () => {
      alive = false
    }
  }, [query, offersRefresh])

  return {
    offers,
    totalCount,
    totalPages,
    page,
    setPage,
    searchText,
    setSearchText,
    orderBy,
    setOrderBy,
    gameId,
    setGameId: handleGameChange,
    genreId,
    setGenreId: handleGenreChange,
    rarityId,
    setRarityId,
    games: filteredGames,
    genres,
    rarities,
    loading,
    error,
  }
}
