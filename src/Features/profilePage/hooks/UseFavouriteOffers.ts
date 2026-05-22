import { FavouriteService } from "@/shared/api/services/FavouriteService"
import { selectCounter, useAppStore } from "@/shared/store/appStore"
import type { offerListingDtoResponse } from "@/shared/types/offerTypes/RequestResponseTypes"
import type { PagedResponse } from "@/shared/types/PagedType"
import { useCallback, useEffect, useState } from "react"

export function useFavouriteOffers(enabled: boolean, page = 1, pageSize = 10) {
  const [favouriteOffers, setFavouriteOffers] =
    useState<PagedResponse<offerListingDtoResponse> | null>(null)
  const [favouriteLoading, setFavouriteLoading] = useState(false)
  const [favouriteError, setFavouriteError] = useState<string | null>(null)

  const refreshKey = useAppStore(selectCounter("favourite:list"))

  const fetchFavourites = useCallback(async () => {
    setFavouriteLoading(true)
    setFavouriteError(null)
    try {
      const res = await FavouriteService.getFavourites({ page, pageSize })
      if (!res.isSuccess || !res.data) {
        setFavouriteError(
          res.message ?? "Nie udało się załadować ulubionych ofert."
        )
        setFavouriteOffers({
          page: page,
          pageSize: pageSize,
          totalCount: 0,
          totalPages: 1,
          elements: [],
        })
        return
      }
      setFavouriteOffers(res.data)
    } catch {
      setFavouriteError("Nie udało się załadować ulubionych ofert.")
      setFavouriteOffers({
        page: page,
        pageSize: pageSize,
        totalCount: 0,
        totalPages: 1,
        elements: [],
      })
    } finally {
      setFavouriteLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    if (!enabled) {
      setFavouriteOffers(null)
      setFavouriteError(null)
      setFavouriteLoading(false)
      return
    }
    void fetchFavourites()
  }, [enabled, fetchFavourites, refreshKey])

  return { favouriteOffers, favouriteLoading, favouriteError }
}
