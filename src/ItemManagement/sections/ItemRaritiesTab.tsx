import { useEffect, useMemo, useRef, useState } from "react"
import { GamesService } from "@/api/services/GamesService"
import { ItemRaritiesService } from "@/api/services/ItemRaritiesService"
import useDebouncedValue from "../useDebouncedValue"
import SearchInput from "../components/SearchInput"
import Paginator from "../components/Paginator"
import EntityCard from "../components/EntityCard"
import { DeleteEntityDialog } from "../components/DeleteEntityDialog"

import { Input } from "@/shared/components/input"
import { Button } from "@/shared/components/button"
import type { DropdownOption } from "@/shared/types/itemManagementTypes/DropdownTypes"
import AddItemRarityDialog from "../components/AddDialogs/AddItemRarityDialog"
import EditItemRarityDialog from "../components/EditDialogs/EditItemRarityDialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/select"

type RarityDto = { id: number; name: string }

const ItemRaritiesTab = () => {
  const pageSize = 10

  const [games, setGames] = useState<DropdownOption[]>([])
  const [gameId, setGameId] = useState<number | null>(null)

  const [gamesOpen, setGamesOpen] = useState(false)
  const [gameSearch, setGameSearch] = useState("")
  const gameQ = useDebouncedValue(gameSearch, 250)

  const [search, setSearch] = useState("")
  const q = useDebouncedValue(search, 300)

  const [page, setPage] = useState(1)

  const [data, setData] = useState<{
    items: RarityDto[]
    totalCount: number
    totalPages: number
  } | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<RarityDto | null>(null)

  const loadSeq = useRef(0)

  const extractDropdownItems = (res: any): DropdownOption[] => {
    const d = res?.data
    if (!d) return []
    return ((d?.items ?? d?.elements ?? d) as DropdownOption[]) ?? []
  }

  const loadGamesDropdown = async () => {
    try {
      const res = await GamesService.dropdown(gameQ || "")
      if (!res?.isSuccess) {
        setGames([])
        setGameId(null)
        return
      }

      const list = extractDropdownItems(res)
      setGames(list)

      if (list.length === 0) {
        setGameId(null)
        return
      }

      if (!gameId || !list.some((x) => x.id === gameId)) {
        setGameId(list[0].id)
      }
    } catch {
      setGames([])
      setGameId(null)
    }
  }

  const loadWith = async (args: {
    page: number
    gameId: number
    q?: string
  }) => {
    const mySeq = ++loadSeq.current

    setLoading(true)
    setError(null)

    const res = await ItemRaritiesService.getPaged({
      page: args.page,
      pageSize,
      gameId: args.gameId,
      searchText: args.q || undefined,
    })

    if (mySeq !== loadSeq.current)
      return { ok: false as const, ignored: true as const }

    setLoading(false)

    if (!res.isSuccess || !res.data) {
      setError(res.message ?? "Nie udało się pobrać rzadkości.")
      setData({ items: [], totalCount: 0, totalPages: 1 })
      return { ok: false as const, ignored: false as const }
    }

    setData({
      items: (res.data as any).items ?? (res.data as any).elements ?? [],
      totalCount: res.data.totalCount ?? 0,
      totalPages: res.data.totalPages ?? 1,
    })

    return { ok: true as const, ignored: false as const }
  }

  const load = async () => {
    if (!gameId) return
    await loadWith({ page, gameId, q: q || undefined })
  }

  const reloadAfterMutation = async () => {
    if (!gameId) return

    const first = await loadWith({ page, gameId, q: q || undefined })
    if (first.ok || first.ignored) return

    if (page > 1) {
      const newPage = page - 1
      setPage(newPage)
      await loadWith({ page: newPage, gameId, q: q || undefined })
    }
  }

  useEffect(() => {
    if (!gamesOpen) return
    void loadGamesDropdown()
  }, [gamesOpen, gameQ])

  useEffect(() => {
    setPage(1)
  }, [q, gameId])

  useEffect(() => {
    void load()
  }, [page, q, gameId])

  const selectedGameName = useMemo(
    () => (gameId ? (games.find((x) => x.id === gameId)?.name ?? "") : ""),
    [gameId, games]
  )

  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1
  const items = data?.items ?? []

  const onEdit = (r: RarityDto) => {
    setSelected(r)
    setEditOpen(true)
  }

  const onDelete = (r: RarityDto) => {
    setSelected(r)
    setDeleteOpen(true)
  }

  const saveAdd = async (payload: { name: string }) => {
    if (!gameId) return
    setError(null)

    const res = await ItemRaritiesService.create({
      gameId,
      rarityName: payload.name,
    })

    if (!res.isSuccess) {
      setError(res.message ?? "Nie udało się dodać rzadkości.")
      return
    }

    setAddOpen(false)
    await reloadAfterMutation()
  }

  const saveEdit = async (payload: { name: string }) => {
    if (!selected) return
    setError(null)

    const res = await ItemRaritiesService.update(selected.id, {
      rarityName: payload.name,
    })

    setEditOpen(false)
    setSelected(null)
    await reloadAfterMutation()
  }

  const confirmDelete = async () => {
    if (!selected) return
    setError(null)

    const res = await ItemRaritiesService.softDelete(selected.id)

    setDeleteOpen(false)
    setSelected(null)
    await reloadAfterMutation()
  }

  return (
    <div className="space-y-4">
      <Select
        value={String(gameId ?? "")}
        onValueChange={(v) => setGameId(Number(v))}
        open={gamesOpen}
        onOpenChange={setGamesOpen}
      >
        <SelectTrigger>
          <SelectValue placeholder="Wybierz grę..." />
        </SelectTrigger>

        <SelectContent>
          <div className="p-2">
            <Input
              value={gameSearch}
              onChange={(e) => setGameSearch(e.target.value)}
              placeholder="Szukaj gry..."
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            />
          </div>

          {games.length === 0 ? (
            <div className="px-3 pb-2 text-sm opacity-70">Brak wyników</div>
          ) : (
            games.map((g) => (
              <SelectItem key={g.id} value={String(g.id)}>
                {g.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm opacity-70">
          {gameId ? `Gra: ${selectedGameName}` : "Wybierz grę"}
        </div>

        <Button onClick={() => setAddOpen(true)} disabled={!gameId}>
          Dodaj rzadkość
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Szukaj rzadkości..."
      />

      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading && <div className="text-sm opacity-70">Ładowanie...</div>}

      {!gameId ? (
        <div className="text-sm opacity-70">
          Wybierz grę, aby zobaczyć rzadkości itemków.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <EntityCard
              key={r.id}
              title={r.name}
              metaLeft={`Gra: ${selectedGameName}`}
              id={r.id}
              onEdit={() => onEdit(r)}
              onDelete={() => onDelete(r)}
            />
          ))}
        </div>
      )}

      <Paginator
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      <AddItemRarityDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={saveAdd}
      />

      {selected && (
        <>
          <EditItemRarityDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            initialName={selected.name}
            onSave={saveEdit}
          />

          <DeleteEntityDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title="Usunąć rzadkość?"
            description="Ta operacja ustawi IsDeleted=true. Rzadkość zniknie z list, ale historia zostaje."
            onConfirm={confirmDelete}
          />
        </>
      )}
    </div>
  )
}

export default ItemRaritiesTab
