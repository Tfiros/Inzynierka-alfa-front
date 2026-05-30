import { UserInfoService } from "@/shared/api/services/UserInfoService"
import { selectCounter, useAppStore } from "@/shared/store/appStore"
import type { offerListingDtoResponse } from "@/shared/types/offerTypes/RequestResponseTypes"
import type { PagedResponse } from "@/shared/types/PagedType"
import { useCallback, useEffect, useState } from "react"

export const useUserOffers = (
  userId: number,
  activePageCounter = 1,
  historyPageCounter = 1,
  pageSize = 10
) => {
  const [activeOffers, setActiveOffers] =
    useState<PagedResponse<offerListingDtoResponse> | null>(null)
  const [historyOffers, setHistoryOffers] =
    useState<PagedResponse<offerListingDtoResponse> | null>(null)
  const [loadingActive, setLoadingActive] = useState<boolean>(false)
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false)
  const [errorActive, setErrorActive] = useState<string | null>(null)
  const [errorHistory, setErrorHistory] = useState<string | null>(null)

  const fetchActiveOffers = useCallback(async () => {
    if (!userId || Number.isNaN(userId)) return
    setLoadingActive(true)
    setErrorActive(null)
    try {
      const res = await UserInfoService.getPagedUserActiveOffers({
        userId,
        page: activePageCounter,
        pageSize,
      })
      if (!res.isSuccess || !res.data) {
        setErrorActive(
          res.message ?? "Nie udało się załadować aktywnych ofert."
        )
        setActiveOffers({
          page: activePageCounter,
          pageSize: pageSize,
          totalCount: 0,
          totalPages: 1,
          elements: [],
        })
        return
      }
      setActiveOffers(res.data)
    } catch {
      setErrorActive("Wystąpił błąd podczas ładowania aktywnych ofert.")
      setActiveOffers({
        page: activePageCounter,
        pageSize: pageSize,
        totalCount: 0,
        totalPages: 1,
        elements: [],
      })
    } finally {
      setLoadingActive(false)
    }
  }, [userId, activePageCounter, pageSize])

  const fetchHistoryOffers = useCallback(async () => {
    if (!userId || Number.isNaN(userId)) return
    setLoadingHistory(true)
    setErrorHistory(null)
    try {
      const res = await UserInfoService.getPagedUserHistoryOffers({
        userId,
        page: historyPageCounter,
        pageSize,
      })
      if (!res.isSuccess || !res.data) {
        setErrorHistory(
          res.message ?? "Nie udało się załadować historii ofert."
        )
        setHistoryOffers({
          page: historyPageCounter,
          pageSize: pageSize,
          totalCount: 0,
          totalPages: 1,
          elements: [],
        })
        return
      }
      setHistoryOffers(res.data)
    } catch {
      setErrorHistory("Wystąpił błąd podczas ładowania historii ofert.")
      setHistoryOffers({
        page: historyPageCounter,
        pageSize: pageSize,
        totalCount: 0,
        totalPages: 1,
        elements: [],
      })
    } finally {
      setLoadingHistory(false)
    }
  }, [userId, historyPageCounter, pageSize])
  const myOffersRefresh = useAppStore(selectCounter("offers:my"))
  useEffect(() => {
    if (!userId || Number.isNaN(userId)) return
    void fetchActiveOffers()
    void fetchHistoryOffers()
    void useAppStore.getState().loadFavouriteIds()
  }, [fetchActiveOffers, myOffersRefresh, fetchHistoryOffers])
  return {
    activeOffers,
    historyOffers,
    loadingActive,
    loadingHistory,
    errorActive,
    errorHistory,
    fetchActiveOffers,
    fetchHistoryOffers,
  }
}
