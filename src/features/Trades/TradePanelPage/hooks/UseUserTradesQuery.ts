import { useMemo, useState } from "react"
import type {
  TradesQuery,
  TradeSearchBy,
  TradeSortBy,
} from "@/shared/types/tradeTypes/MiddlemanTypes"
import type { MiddlemanTab } from "@/shared/types/tradeTypes/MiddlemanTypes"

type State = {
  tab: MiddlemanTab
  page: number
  pageSize: number

  searchText: string
  searchBy: TradeSearchBy | null

  minTokenCost: string
  maxTokenCost: string

  createdFrom: string
  createdTo: string

  sortBy: TradeSortBy | null
  readyForCompletion: boolean | null
}

const DEFAULT_PAGE_SIZE = 10

const toNumOrNull = (s: string): number | null => {
  const t = s.trim()
  if (!t.length) return null
  const n = Number(t)
  return Number.isFinite(n) ? n : null
}

const toIsoOrNull = (s: string): string | null => {
  const t = s.trim()
  return t.length ? t : null
}

const useUserTradesQuery = (initialTab: MiddlemanTab = "available") => {
  const [state, setState] = useState<State>({
    tab: initialTab,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,

    searchText: "",
    searchBy: null,

    minTokenCost: "",
    maxTokenCost: "",

    createdFrom: "",
    createdTo: "",

    sortBy: null,
    readyForCompletion: null,
  })

  const q = useMemo<TradesQuery>(() => {
    return {
      searchText: state.searchText.trim().length
        ? state.searchText.trim()
        : null,
      searchBy: state.searchBy ?? null,

      minTokenCost: toNumOrNull(state.minTokenCost),
      maxTokenCost: toNumOrNull(state.maxTokenCost),

      createdFrom: toIsoOrNull(state.createdFrom),
      createdTo: toIsoOrNull(state.createdTo),

      sortBy: state.sortBy ?? null,
      readyForCompletion: state.readyForCompletion ?? null,
    }
  }, [state])

  const actions = {
    setTab: (tab: MiddlemanTab) => setState((s) => ({ ...s, tab, page: 1 })),
    setPage: (page: number) => setState((s) => ({ ...s, page })),
    setPageSize: (pageSize: number) =>
      setState((s) => ({ ...s, pageSize, page: 1 })),

    setSearchText: (searchText: string) =>
      setState((s) => ({ ...s, searchText, page: 1 })),
    setSearchBy: (searchBy: TradeSearchBy | null) =>
      setState((s) => ({ ...s, searchBy, page: 1 })),

    setMinTokenCost: (v: string) =>
      setState((s) => ({ ...s, minTokenCost: v, page: 1 })),
    setMaxTokenCost: (v: string) =>
      setState((s) => ({ ...s, maxTokenCost: v, page: 1 })),

    setCreatedFrom: (v: string) =>
      setState((s) => ({ ...s, createdFrom: v, page: 1 })),
    setCreatedTo: (v: string) =>
      setState((s) => ({ ...s, createdTo: v, page: 1 })),

    setSortBy: (sortBy: TradeSortBy | null) =>
      setState((s) => ({ ...s, sortBy, page: 1 })),

    setReadyForCompletion: (v: boolean | null) =>
      setState((s) => ({ ...s, readyForCompletion: v, page: 1 })),

    reset: () =>
      setState((s) => ({
        ...s,
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,

        searchText: "",
        searchBy: null,

        minTokenCost: "",
        maxTokenCost: "",
        createdFrom: "",
        createdTo: "",
        sortBy: null,
        readyForCompletion: null,
      })),
  }

  return { state, q, actions }
}

export default useUserTradesQuery
