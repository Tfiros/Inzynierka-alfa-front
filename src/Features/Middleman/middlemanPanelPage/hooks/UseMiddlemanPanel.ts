import { useMemo } from "react"
import useDebouncedValue from "./UseDebouncedValue"
import useMiddlemanTradesQuery from "./UseMiddlemanTradesQuery"
import useMiddlemanStats from "./UseMiddlemanStats"
import useMiddlemanTradesList from "./UseMiddlemanTradesList"
import useAssignMiddleman from "./UseAssignMiddleman"

const useMiddlemanPanel = () => {
  const { state, q, actions } = useMiddlemanTradesQuery("available")
  const debouncedSearchText = useDebouncedValue(state.searchText, 350)

  const effectiveQuery = useMemo(() => {
    const st = debouncedSearchText.trim()
    return { ...q, searchText: st.length ? st : null }
  }, [q, debouncedSearchText])

  const stats = useMiddlemanStats()

  const list = useMiddlemanTradesList({
    tab: state.tab,
    page: state.page,
    pageSize: state.pageSize,
    query: effectiveQuery,
    clearOnLoad: false, // ustaw true jeśli chcesz czyścić listę przy przełączaniu taba
  })

  // jeżeli po assign chcesz odświeżać też stats — zrób Promise.all([stats.refetchStats(), list.refetchList()])
  const assign = useAssignMiddleman({
    onSuccessRefetch: async () => {
      await Promise.all([stats.refetchStats(), list.refetchList()])
    },
  })

  const counts = useMemo(() => {
    return {
      available: stats.stats?.available ?? 0,
      mine: stats.stats?.myActive ?? 0,
      completed: stats.stats?.completed ?? 0,
      all: stats.stats?.all ?? 0,
    }
  }, [stats.stats])

  return {
    query: { state, actions, effectiveQuery },
    stats,
    list,
    assign,
    counts,
  }
}

export default useMiddlemanPanel
