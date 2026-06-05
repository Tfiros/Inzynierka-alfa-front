import { useCallback, useEffect, useMemo } from "react"
import useUserTradesQuery from "./UseUserTradesQuery"
import useUserStats from "./UseUserStats"
import useUserTradesList from "./UseUserTradesList"
import useAssignMiddleman from "./UseAssignMiddleman"
import useTradeDetailsDialog from "./UseTradeDetailsDialog"
import { useAppStore } from "@/shared/store/appStore"
import useDeleteTrade from "./UseDeleteTrade"
import { useDebounceValue } from "@/shared/hooks/UseDebounceValue"
import { useSearchParams } from "react-router-dom"
import useLinkedTradeDialog from "./UseLinkedTradeDialog"

const useTradePanel = () => {
  const { state, q, actions } = useUserTradesQuery("available")
  const debouncedSearchText = useDebounceValue(state.searchText, 350)
  const roles = useAppStore((s) => s.roles)
  const isMiddleman =
    roles.some((r) => r.toLowerCase() === "middleman") ||
    roles.some((r) => r.toLowerCase() === "admin")

  const effectiveQuery = useMemo(() => {
    const st = debouncedSearchText.trim()

    return {
      ...q,
      searchText: st.length >= 2 ? st : null,
      searchBy: st.length >= 2 ? q.searchBy : null,
    }
  }, [q, debouncedSearchText])
  const stats = useUserStats()

  const list = useUserTradesList({
    tab: state.tab,
    page: state.page,
    pageSize: state.pageSize,
    query: effectiveQuery,
    clearOnLoad: false,
    isMiddleman: isMiddleman,
  })

  const assign = useAssignMiddleman({
    onSuccessRefetch: async () => {
      await Promise.all([stats.refetchStats(), list.refetchList()])
    },
  })

  const details = useTradeDetailsDialog()

  const onDetailsSaved = useCallback(async () => {
    await Promise.all([
      details.actions.refresh(),
      list.refetchList(),
      stats.refetchStats(),
    ])
  }, [details.actions.refresh, list.refetchList, stats.refetchStats])

  const counts = {
    available: stats.stats?.created ?? 0,
    mine: stats.stats?.myActive ?? 0,
    completed: stats.stats?.completed ?? 0,
    all: stats.stats?.all ?? 0,
  }

  const cancelation = useDeleteTrade()
  const [searchParams, setSearchParams] = useSearchParams()
  const linkTradeId = Number(searchParams.get("tradeId"))
  const linkedTrade = useLinkedTradeDialog()

  const closeLinkedTrade = useCallback(() => {
    linkedTrade.close()

    const next = new URLSearchParams(searchParams)
    next.delete("tradeId")
    setSearchParams(next, { replace: true })
  }, [linkedTrade.close, searchParams, setSearchParams])

  useEffect(() => {
    if (!Number.isFinite(linkTradeId) || linkTradeId <= 0) return
    void linkedTrade.openForId(linkTradeId)
  }, [linkTradeId, linkedTrade.openForId])

  return {
    query: { state, actions, effectiveQuery },
    stats,
    list,
    assign,
    counts,
    details,
    cancelation,
    isMiddleman,
    linkedTrade: {
      state: linkedTrade.state,
      close: closeLinkedTrade,
    },
    onDetailsSaved,
  }
}

export default useTradePanel
