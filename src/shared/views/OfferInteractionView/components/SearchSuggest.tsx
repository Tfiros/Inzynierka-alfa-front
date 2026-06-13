import { Command } from "@/shared/components/command"
import { Input } from "@/shared/components/input"
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/shared/components/popover"
import { CommandGroup, CommandItem, CommandList } from "cmdk"
import { Search, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import type { ItemOfferDto } from "@/shared/types/offerTypes/RequestResponseTypes"
import Thumb from "./Thumb"
import { Skeleton } from "@/shared/components/skeleton"

type Props = {
  value: string
  onChange: (value: string) => void
  suggestions: ItemOfferDto[]
  loading: boolean
  error: string | null
  onPickSuggestion: (s: ItemOfferDto) => void
  disabled: boolean
  lockedItem?: ItemOfferDto | null
  onUnlock?: () => void
  pending?: boolean
}

type Group = {
  gameName: string
  gameId: number
  gamePhotoUrl?: string | null
  items: ItemOfferDto[]
}

const SearchSuggest = ({
  value,
  onChange,
  suggestions,
  loading,
  error,
  onPickSuggestion,
  disabled,
  lockedItem,
  onUnlock,
  pending = false,
}: Props) => {
  const [open, setOpen] = useState(false)
  const query = value.trim()
  const canShow = query.length >= 1
  const canSearch = query.length >= 3
  const isSearching = pending || loading
  const closeTimer = useRef<number | null>(null)

  const groups = useMemo(() => groupBy(suggestions), [suggestions])

  useEffect(() => {
    if (canShow) {
      if (closeTimer.current) {
        window.clearTimeout(closeTimer.current)
        closeTimer.current = null
      }
      setOpen(true)
    } else {
      closeTimer.current = window.setTimeout(() => setOpen(false), 200)
    }

    return () => {
      if (closeTimer.current) {
        window.clearTimeout(closeTimer.current)
      }
    }
  }, [canShow])
  if (lockedItem) {
    return (
      <div className="flex items-center gap-2 h-10 rounded-xl border bg-white border-muted-foreground px-3">
        <Thumb src={lockedItem.photoUrl} alt={lockedItem.name} size="sm" />
        <span className="flex-1 text-sm truncate">{lockedItem.name}</span>
        <button
          type="button"
          onClick={onUnlock}
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
            }}
            placeholder="Wpisz nazwę przedmiotu..."
            className="h-10 rounded-xl pl-12 bg-white border-muted-foreground/20"
            disabled={disabled}
          />
        </div>
      </PopoverAnchor>
      {canShow && (
        <PopoverContent
          align="start"
          className="z-[100] w-[min(900px,calc(100vw-3rem))] p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Command shouldFilter={false}>
            <CommandList
              className="max-h-[320px] overflow-auto"
              onWheelCapture={(e) => e.stopPropagation()}
            >
              {!canSearch && (
                <div className="px-3 py-4 text-sm text-muted-foreground">
                  Wpisz min. 3 znaki aby wyszukać...
                </div>
              )}
              {canSearch && isSearching && (
                <CommandGroup heading="Szukam...">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 px-2 py-3">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-4 w-40 rounded" />
                    </div>
                  ))}
                </CommandGroup>
              )}
              {canSearch && !isSearching && error && (
                <CommandGroup heading="Błąd">
                  <div className="px-3 py-3 text-sm text-red-500">{error}</div>
                </CommandGroup>
              )}
              {canSearch &&
                !isSearching &&
                !error &&
                suggestions.length === 0 && (
                  <div className="px-3 py-4 text-sm text-muted-foreground">
                    Brak wyników dla "{query}".
                  </div>
                )}

              {canSearch &&
                !isSearching &&
                !error &&
                suggestions.length > 0 && (
                  <>
                    {groups.map((game) => (
                      <CommandGroup
                        key={game.gameId}
                        className="border-t border-border first:border-t-0 py-2"
                      >
                        <CommandItem
                          disabled
                          className="pointer-events-none select-none bg-muted py-2"
                        >
                          <div className="flex items-center gap-3">
                            <Thumb
                              src={game.gamePhotoUrl}
                              alt={game.gameName}
                              size="sm"
                            />
                            <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                              {game.gameName}
                            </span>
                          </div>
                        </CommandItem>
                        {game.items.map((s) => (
                          <CommandItem
                            key={s.id}
                            value={s.name}
                            onSelect={() => {
                              onPickSuggestion(s)
                              setOpen(false)
                            }}
                            className="py-3 pl-6 flex items-center gap-3"
                          >
                            <Thumb src={s.photoUrl} alt={s.name} size="md" />
                            <span>{s.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </>
                )}
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  )
}

export default SearchSuggest

function groupBy(list: ItemOfferDto[]): Group[] {
  const map = new Map<number, Group>()
  for (const s of list) {
    const gameName = s.game.name ?? "Inne"
    const gamePhotoUrl = s.game.photoUrl
    const gameId = s.game.id
    const existing = map.get(gameId)
    if (!existing) {
      map.set(gameId, { gameName, gamePhotoUrl, gameId, items: [s] })
    } else {
      if (!existing.gamePhotoUrl && gamePhotoUrl) {
        existing.gamePhotoUrl = gamePhotoUrl
      }
      existing.items.push(s)
    }
  }
  return Array.from(map.values())
}
