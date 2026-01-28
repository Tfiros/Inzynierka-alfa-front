import { OfferService } from "@/shared/api/services/OfferService"
import { selectCounter, useAppStore } from "@/shared/store/AppStore"
import { offerOrderBy } from "@/shared/types/offerTypes/OfferTypes"
import type {
  offerListingDtoResponse,
  offerListingQueryRequest,
} from "@/shared/types/offerTypes/RequestResponseTypes"
import { useEffect, useMemo, useState } from "react"

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

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const offersRefresh = useAppStore(selectCounter("offers:list"))

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchText, orderBy, pageSize])

  const query: offerListingQueryRequest = useMemo(
    () => ({
      page: page,
      pageSize: pageSize,
      searchText: debouncedSearchText,
      orderBy: orderBy,
    }),
    [page, pageSize, debouncedSearchText, orderBy]
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
    searchText: debouncedSearchText,
    setSearchText,
    orderBy,
    setOrderBy,
    loading,
    error,
  }
}
