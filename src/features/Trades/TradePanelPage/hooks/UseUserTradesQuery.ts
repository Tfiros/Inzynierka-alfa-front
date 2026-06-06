import { useMemo, useState } from "react"
import type {
  TradesQuery,
  TradeSearchBy,
  TradeSortBy,
} from "@/shared/types/tradeTypes/MiddlemanTypes"
import type { MiddlemanTab } from "@/shared/types/tradeTypes/MiddlemanTypes"
import { useDebounceValue } from "@/shared/hooks/UseDebounceValue"

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
  onlyMine: boolean
}

const DEFAULT_PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 350
const MIN_SEARCH_LENGTH = 2

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
    onlyMine: false,
  })

  const debouncedSearchText = useDebounceValue(
    state.searchText,
    SEARCH_DEBOUNCE_MS
  )

  const q = useMemo<TradesQuery>(() => {
    const searchText = debouncedSearchText.trim()
    const shouldSearch = searchText.length >= MIN_SEARCH_LENGTH

    return {
      searchText: shouldSearch ? searchText : null,
      searchBy: shouldSearch ? state.searchBy : null,

      minTokenCost: toNumOrNull(state.minTokenCost),
      maxTokenCost: toNumOrNull(state.maxTokenCost),

      createdFrom: toIsoOrNull(state.createdFrom),
      createdTo: toIsoOrNull(state.createdTo),

      sortBy: state.sortBy,
      readyForCompletion: state.readyForCompletion,
      onlyMine: state.onlyMine,
    }
  }, [
    debouncedSearchText,
    state.searchBy,
    state.minTokenCost,
    state.maxTokenCost,
    state.createdFrom,
    state.createdTo,
    state.sortBy,
    state.readyForCompletion,
    state.onlyMine,
  ])

  const actions = {
    setTab: (tab: MiddlemanTab) => setState((s) => ({ ...s, tab, page: 1 })),

    setPage: (page: number) => setState((s) => ({ ...s, page })),

    setPageSize: (pageSize: number) =>
      setState((s) => ({ ...s, pageSize, page: 1 })),

    setSearchText: (searchText: string) =>
      setState((s) => ({ ...s, searchText, page: 1 })),

    setSearchBy: (searchBy: TradeSearchBy | null) =>
      setState((s) => ({ ...s, searchBy, page: 1 })),

    setMinTokenCost: (minTokenCost: string) =>
      setState((s) => ({ ...s, minTokenCost, page: 1 })),

    setMaxTokenCost: (maxTokenCost: string) =>
      setState((s) => ({ ...s, maxTokenCost, page: 1 })),

    setCreatedFrom: (createdFrom: string) =>
      setState((s) => ({ ...s, createdFrom, page: 1 })),

    setCreatedTo: (createdTo: string) =>
      setState((s) => ({ ...s, createdTo, page: 1 })),

    setSortBy: (sortBy: TradeSortBy | null) =>
      setState((s) => ({ ...s, sortBy, page: 1 })),

    setReadyForCompletion: (readyForCompletion: boolean | null) =>
      setState((s) => ({ ...s, readyForCompletion, page: 1 })),

    setOnlyMine: (onlyMine: boolean) =>
      setState((s) => ({ ...s, onlyMine, page: 1 })),

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
        onlyMine: false,
      })),
  }

  return { state, q, actions }
}

export default useUserTradesQuery
