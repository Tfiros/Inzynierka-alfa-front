import { useMemo } from "react"
import useUserTradesQuery from "./UseUserTradesQuery"
import useUserStats from "./UseUserStats"
import useUserTradesList from "./UseUserTradesList"
import useAssignMiddleman from "./UseAssignMiddleman"
import useTradeDetailsDialog from "./UseTradeDetailsDialog"
import { useAppStore } from "@/shared/store/appStore"
import useDeleteTrade from "./UseDeleteTrade"
import { useDebounceValue } from "@/shared/hooks/UseDebounceValue"

const useTradePanel = () => {
  const { state, q, actions } = useUserTradesQuery("available")
  const debouncedSearchText = useDebounceValue(state.searchText, 350)
  const roles = useAppStore((s) => s.roles)
  const isMiddleman = roles.some((r) => r.toLowerCase() === "middleman")

  const effectiveQuery = useMemo(() => {
    const st = debouncedSearchText.trim()
    return { ...q, searchText: st.length ? st : null }
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

  const counts = {
    available: stats.stats?.created ?? 0,
    mine: stats.stats?.myActive ?? 0,
    completed: stats.stats?.completed ?? 0,
    all: stats.stats?.all ?? 0,
  }

  console.log(counts.available)
  console.log(counts.mine)
  console.log(counts.completed)
  console.log(counts.all)

  const cancelation = useDeleteTrade()

  return {
    query: { state, actions, effectiveQuery },
    stats,
    list,
    assign,
    counts,
    details,
    cancelation,
    isMiddleman,
  }
}

export default useTradePanel
