import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
import { RotateCcw, Search } from "lucide-react"
import type {
  MiddlemanTab,
  TradeSearchBy,
  TradeSortBy,
} from "@/shared/types/tradeTypes/MiddlemanTypes"
import {
  TradeSearchBy as TradeSearchByConst,
  TradeSortBy as TradeSortByConst,
} from "@/shared/types/tradeTypes/MiddlemanTypes"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/select"
import DatePickerInput from "../components/DatePickerInput"

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

type Actions = {
  setSearchText: (v: string) => void
  setSearchBy: (v: TradeSearchBy | null) => void
  setMinTokenCost: (v: string) => void
  setMaxTokenCost: (v: string) => void
  setCreatedFrom: (v: string) => void
  setCreatedTo: (v: string) => void
  setSortBy: (v: TradeSortBy | null) => void
  setReadyForCompletion: (v: boolean | null) => void
  setPageSize: (v: number) => void

  setOnlyMine: (v: boolean) => void

  reset: () => void
}

type Props = {
  tab: MiddlemanTab
  state: State
  actions: Actions
  isMiddleman: boolean
}

const PAGE_SIZES = [10, 20, 50]

const SEARCH_BY_OPTIONS: { value: TradeSearchBy; label: string }[] = [
  { value: TradeSearchByConst.TradeId, label: "TradeId" },
  { value: TradeSearchByConst.OfferId, label: "OfferId" },
  { value: TradeSearchByConst.CustomerNickname, label: "Nick klienta" },
  { value: TradeSearchByConst.CustomerEmail, label: "Email klienta" },
  {
    value: TradeSearchByConst.PostingUserNickname,
    label: "Nick wystawiającego",
  },
  { value: TradeSearchByConst.PostingUserEmail, label: "Email wystawiającego" },
]

const SORT_OPTIONS: { value: TradeSortBy; label: string }[] = [
  { value: TradeSortByConst.CreationDateAsc, label: "Data ↑" },
  { value: TradeSortByConst.CreationDateDesc, label: "Data ↓" },
  { value: TradeSortByConst.CreationCostAsc, label: "Koszt oferty ↑" },
  { value: TradeSortByConst.CreationCostDesc, label: "Koszt oferty ↓" },
  { value: TradeSortByConst.TradeIdAsc, label: "TradeId ↑" },
  { value: TradeSortByConst.TradeIdDesc, label: "TradeId ↓" },
]

const FiltersSection = ({ tab, state, actions, isMiddleman }: Props) => {
  const showReadyForCompletion = tab !== "available"
  const showOnlyMine = isMiddleman

  return (
    <div className="mt-6 rounded-xl border bg-card p-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.5fr_auto] lg:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={state.searchText}
            onChange={(e) => actions.setSearchText(e.target.value)}
            className="pl-9"
            placeholder="Szukaj…"
          />
        </div>

        <Select
          value={state.searchBy ? String(state.searchBy) : "null"}
          onValueChange={(v) =>
            actions.setSearchBy(
              v === "null" ? null : (Number(v) as TradeSearchBy)
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Szukaj po" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">—</SelectItem>
            {SEARCH_BY_OPTIONS.map((o) => (
              <SelectItem key={String(o.value)} value={String(o.value)}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={state.sortBy ? String(state.sortBy) : "null"}
          onValueChange={(v) =>
            actions.setSortBy(v === "null" ? null : (Number(v) as TradeSortBy))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sortowanie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">Domyślne</SelectItem>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={String(o.value)} value={String(o.value)}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(state.pageSize)}
          onValueChange={(v) => actions.setPageSize(Number(v))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Na stronę" />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZES.map((s) => (
              <SelectItem key={s} value={String(s)}>
                {s}/str
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex justify-end">
          <Button variant="outline" className="gap-2" onClick={actions.reset}>
            <RotateCcw className="h-4 w-4" />
            Odśwież
          </Button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-4">
        <Input
          type="number"
          min={0}
          step={1}
          value={state.minTokenCost}
          onChange={(e) => actions.setMinTokenCost(e.target.value)}
          placeholder="Min token cost"
          inputMode="numeric"
        />

        <Input
          type="number"
          min={0}
          step={1}
          value={state.maxTokenCost}
          onChange={(e) => actions.setMaxTokenCost(e.target.value)}
          placeholder="Max token cost"
          inputMode="numeric"
        />

        <DatePickerInput
          value={state.createdFrom}
          onChange={actions.setCreatedFrom}
          placeholder="Created from"
        />

        <DatePickerInput
          value={state.createdTo}
          onChange={actions.setCreatedTo}
          placeholder="Created to"
        />
      </div>

      {showReadyForCompletion ? (
        <div className="mt-3 flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">Gotowe do zakończenia:</span>
          <Select
            value={
              state.readyForCompletion === null
                ? "null"
                : state.readyForCompletion
                  ? "true"
                  : "false"
            }
            onValueChange={(v) =>
              actions.setReadyForCompletion(v === "null" ? null : v === "true")
            }
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="null">Wszystkie</SelectItem>
              <SelectItem value="true">Tak</SelectItem>
              <SelectItem value="false">Nie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}
      {showOnlyMine ? (
        <div className="mt-3 flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">
            Pokaż tylko moje trade’y:
          </span>

          <input
            type="checkbox"
            checked={state.onlyMine}
            onChange={(e) => actions.setOnlyMine(e.target.checked)}
          />
        </div>
      ) : null}
    </div>
  )
}

export default FiltersSection
