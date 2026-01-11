import { OfferService } from "@/shared/api/services/OfferService"
import { offerOrderBy } from "@/shared/types/offerTypes/OfferTypes"
import type {
  offerListingDtoResponse,
  offerListingQueryRequest,
} from "@/shared/types/offerTypes/RequestResponseTypes"
import type { PagedResponse } from "@/shared/types/PagedType"
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

  const [searchText, setSearchText] = useState<string>("")
  const debouncedSearchText = useDebouncedValue<string>(searchText, 300)
  const [orderBy, setOrderBy] = useState<offerOrderBy>(offerOrderBy.newest)

  const [data, setData] =
    useState<PagedResponse<offerListingDtoResponse> | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

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
        setData({ page, pageSize, totalCount: 0, totalPages: 1, elements: [] })
        return
      }
      console.log("userOfferListing:", res.data)
      setData(res.data)
    }
    void load()
    return () => {
      alive = false
    }
  }, [query, page, pageSize])
  return {
    offers: data?.elements ?? [],
    totalCount: data?.totalCount ?? 0,
    totalPages: data?.totalPages ?? 1,
    page,
    setPage,
    searchText,
    setSearchText,
    orderBy,
    setOrderBy,
    loading,
    error,
  }
}
