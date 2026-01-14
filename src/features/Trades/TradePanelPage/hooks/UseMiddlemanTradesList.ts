import { useCallback, useEffect, useRef, useState } from "react"
import { MiddlemanService } from "@/shared/api/services/MiddlemanService"
import type {
  MiddlemanTab,
  TradeListItem,
  TradesQuery,
} from "@/shared/types/tradeTypes/MiddlemanTypes"
import type { PagedResponse } from "@/shared/types/PagedType"

type State = {
  itemsTab: MiddlemanTab
  items: TradeListItem[]
  totalCount: number
  loadingList: boolean
  errorList: string | null
}

type Args = {
  tab: MiddlemanTab
  page: number
  pageSize: number
  query: TradesQuery
  clearOnLoad?: boolean
}

const useMiddlemanTradesList = ({
  tab,
  page,
  pageSize,
  query,
  clearOnLoad = false,
}: Args) => {
  const reqSeq = useRef(0)

  const [state, setState] = useState<State>({
    itemsTab: tab,
    items: [],
    totalCount: 0,
    loadingList: true,
    errorList: null,
  })

  const fetchList = useCallback(async () => {
    const seq = ++reqSeq.current
    const tabAtStart = tab

    setState((s) => ({
      ...s,
      loadingList: true,
      errorList: null,
      ...(clearOnLoad ? { items: [], totalCount: 0 } : null),
    }))

    const call =
      tabAtStart === "available"
        ? MiddlemanService.getMiddlemanAvailable
        : tabAtStart === "mine"
          ? MiddlemanService.getMiddlemanInRealization
          : tabAtStart === "completed"
            ? MiddlemanService.getMiddlemanCompleted
            : MiddlemanService.getMyFailedWithItemsToReturn

    try {
      const res = await call(page, pageSize, query)
      if (seq !== reqSeq.current) return

      if (!res.isSuccess || !res.data) {
        setState((s) => ({
          ...s,
          loadingList: false,
          items: [],
          totalCount: 0,
          errorList: res.message ?? "Nie udało się pobrać listy wymian.",
        }))
        return
      }

      const data: PagedResponse<TradeListItem> = res.data

      setState((s) => ({
        ...s,
        loadingList: false,
        itemsTab: tabAtStart,
        items: data.elements ?? [],
        totalCount: data.totalCount ?? 0,
        errorList: null,
      }))
    } catch (e: any) {
      if (seq !== reqSeq.current) return
      setState((s) => ({
        ...s,
        loadingList: false,
        errorList: e?.message ?? "Nie udało się pobrać danych.",
      }))
    }
  }, [tab, page, pageSize, query, clearOnLoad])

  useEffect(() => {
    void fetchList()
  }, [fetchList])

  return {
    ...state,
    refetchList: fetchList,
  }
}

export default useMiddlemanTradesList
