import { useCallback, useEffect, useRef, useState } from "react"
import { TradeService } from "@/shared/api/services/TradeService"
import type {
  MiddlemanTab,
  TradeListItem,
  TradesQuery,
} from "@/shared/types/tradeTypes/MiddlemanTypes"
import type { PagedResponse } from "@/shared/types/PagedType"

const toNumber = (value: unknown) => {
  if (value === "" || value === null || value === undefined) {
    return undefined
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : undefined
}

const cleanTrade = (query: TradesQuery): TradesQuery => {
  const cleaned = {
    ...query,
    minTokenCost: toNumber(query.minTokenCost),
    maxTokenCost: toNumber(query.maxTokenCost),
    onlyMine: query.onlyMine === true ? true : undefined,
    readyForCompletion: query.readyForCompletion === true ? true : undefined,
  }

  return Object.fromEntries(
    Object.entries(cleaned).filter(([, value]) => value !== undefined)
  ) as TradesQuery
}

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
  isMiddleman: boolean
}

const useUserTradesList = ({
  tab,
  page,
  pageSize,
  query,
  clearOnLoad = false,
  isMiddleman,
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
        ? TradeService.getMiddlemanAvailable
        : tabAtStart === "mine"
          ? TradeService.getMiddlemanInRealization
          : tabAtStart === "completed"
            ? TradeService.getMiddlemanCompleted
            : TradeService.getMyFailedWithItemsToReturn

    try {
      const cleanedQuery = cleanTrade(query)

      const res = await call(page, pageSize, cleanedQuery)
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

export default useUserTradesList
