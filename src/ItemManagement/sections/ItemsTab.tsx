import { useEffect, useMemo, useState } from "react"
import { GamesService } from "@/api/services/GamesService"
import { ItemsService } from "@/api/services/ItemsService"
import { ItemRaritiesService } from "@/api/services/ItemRaritiesService"
import useDebouncedValue from "../useDebouncedValue"
import SearchInput from "../components/SearchInput"
import Paginator from "../components/Paginator"
import EntityCard from "../components/EntityCard"
import { DeleteEntityDialog } from "../components/DeleteEntityDialog"
import EditItemDialog from "../components/EditDialogs/EditItemDialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { DropdownOption } from "@/shared/types/itemManagementTypes/DropdownTypes"
import type { ItemDto } from "@/shared/types/itemManagementTypes/EntityDtos"

const ItemsTab = () => {
  const [games, setGames] = useState<DropdownOption[]>([])
  const [gameId, setGameId] = useState<number | null>(null)

  const [gamesOpen, setGamesOpen] = useState(false)
  const [gameSearch, setGameSearch] = useState("")
  const gameQ = useDebouncedValue(gameSearch, 250)

  const [search, setSearch] = useState("")
  const q = useDebouncedValue(search, 300)

  const [page, setPage] = useState(1)
  const pageSize = 10

  const [data, setData] = useState<{
    items: ItemDto[]
    totalCount: number
    totalPages: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<ItemDto | null>(null)

  // --- ADD MODAL STATE (new DTO) ---
  const [addOpen, setAddOpen] = useState(false)
  const [addSaving, setAddSaving] = useState(false)

  const [addName, setAddName] = useState("")
  const [addEstimatedTokenValue, setAddEstimatedTokenValue] =
    useState<string>("")

  const [addRarities, setAddRarities] = useState<DropdownOption[]>([])
  const [addRarityId, setAddRarityId] = useState<number | null>(null)

  const [addRaritiesOpen, setAddRaritiesOpen] = useState(false)
  const [addRaritySearch, setAddRaritySearch] = useState("")
  const addRarityQ = useDebouncedValue(addRaritySearch, 250)

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

  const load = async () => {
    if (!gameId) return
    setLoading(true)
    setError(null)

    const res = await ItemsService.getPaged({
      page,
      pageSize,
      gameId,
      searchText: q || undefined,
    })

    setLoading(false)

    if (!res.isSuccess || !res.data) {
      setError(res.message ?? "Nie udało się pobrać itemków.")
      setData({ items: [], totalCount: 0, totalPages: 1 })
      return
    }

    setData({
      items: (res.data as any).items ?? (res.data as any).elements ?? [],
      totalCount: res.data.totalCount ?? 0,
      totalPages: res.data.totalPages ?? 1,
    })
  }

  // --- load games dropdown only when open ---
  useEffect(() => {
    if (!gamesOpen) return
    void loadGamesDropdown()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamesOpen, gameQ])

  useEffect(() => {
    setPage(1)
  }, [q, gameId])

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q, gameId])

  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1
  const items = data?.items ?? []

  const onEdit = (i: ItemDto) => {
    setSelected(i)
    setEditOpen(true)
  }

  const onDelete = (i: ItemDto) => {
    setSelected(i)
    setDeleteOpen(true)
  }

  // === UPDATE DTO on backend:
  // public sealed record UpdateItemRequest(string Name, int EstimatedTokenValue, int RarityItemId);
  const saveEdit = async (payload: {
    name: string
    estimatedTokenValue: number
    rarityItemId: number
  }) => {
    if (!selected) return

    const res = await ItemsService.update(selected.id, payload)
    if (!res.isSuccess) {
      setError(res.message ?? "Nie udało się zapisać.")
      return
    }

    setEditOpen(false)
    await load()
  }

  const confirmDelete = async () => {
    if (!selected) return

    setError(null)
    try {
      await ItemsService.softDelete(selected.id)
      setDeleteOpen(false)
      setSelected(null)
      await load()
    } catch (e: any) {
      setError(e?.message ?? "Nie udało się usunąć.")
    }
  }

  const loadAddRaritiesDropdown = async () => {
    if (!gameId) return
    const res = await ItemRaritiesService.dropdown(gameId, addRarityQ || "")

    if (!res?.isSuccess) {
      setAddRarities([])
      setAddRarityId(null)
      return
    }

    const list = extractDropdownItems(res)
    setAddRarities(list)

    if (list.length === 0) {
      setAddRarityId(null)
      return
    }

    if (!addRarityId || !list.some((x) => x.id === addRarityId)) {
      setAddRarityId(list[0].id)
    }
  }

  useEffect(() => {
    if (!addOpen) return
    if (!addRaritiesOpen) return
    void loadAddRaritiesDropdown()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addOpen, addRaritiesOpen, addRarityQ, gameId])

  const resetAddModal = () => {
    setAddName("")
    setAddEstimatedTokenValue("")
    setAddRarities([])
    setAddRarityId(null)
    setAddRaritiesOpen(false)
    setAddRaritySearch("")
  }

  // === CREATE DTO on backend:
  // public sealed record CreateItemRequest(string Name, int EstimatedTokenValue, int GameId, int ItemRarityId);
  const createItem = async () => {
    const name = addName.trim()
    if (!name || !gameId || !addRarityId) return

    const token = Number(addEstimatedTokenValue)
    if (!Number.isFinite(token) || token < 0) return

    setAddSaving(true)
    setError(null)

    try {
      const res = await ItemsService.create({
        name,
        estimatedTokenValue: token,
        gameId,
        itemRarityId: addRarityId,
      })

      if (!res.isSuccess) {
        setError(res.message ?? "Nie udało się dodać itemka.")
        return
      }

      setAddOpen(false)
      resetAddModal()
      await load()
    } finally {
      setAddSaving(false)
    }
  }

  const isAddTokenOk = useMemo(() => {
    const v = addEstimatedTokenValue.trim()
    if (!v) return false
    const n = Number(v)
    return Number.isFinite(n) && n >= 0
  }, [addEstimatedTokenValue])

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

      <div className="flex items-center justify-end">
        <Button
          onClick={() => {
            resetAddModal()
            setAddOpen(true)
          }}
          disabled={!gameId}
        >
          Dodaj itemek
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Szukaj itemków..."
      />

      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading && <div className="text-sm opacity-70">Ładowanie...</div>}

      <div className="space-y-3">
        {items.map((i) => (
          <EntityCard
            key={i.id}
            title={i.name}
            subtitle={undefined}
            metaLeft={`Gra: ${i.gameName}`}
            id={i.id}
            onEdit={() => onEdit(i)}
            onDelete={() => onDelete(i)}
          />
        ))}
      </div>

      <Paginator
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      {selected && (
        <>
          <EditItemDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            // Edit dialog musi zostać dopasowany pod nowe DTO.
            // Zakładam, że ItemDto ma pola:
            // - estimatedTokenValue
            // - itemRarityId (albo rarityItemId)
            initialName={selected.name}
            initialEstimatedTokenValue={
              (selected as any).estimatedTokenValue ?? 0
            }
            initialGameId={selected.gameId}
            initialRarityItemId={
              (selected as any).itemRarityId ??
              (selected as any).rarityItemId ??
              0
            }
            onSave={saveEdit}
          />

          <DeleteEntityDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title="Usunąć itemek?"
            description="Ta operacja ustawi IsDeleted=true. Item zniknie z list, ale historia zostaje."
            onConfirm={confirmDelete}
          />
        </>
      )}

      {/* ADD ITEM MODAL (inline) */}
      <Dialog
        open={addOpen}
        onOpenChange={(v) => {
          setAddOpen(v)
          if (!v) resetAddModal()
        }}
      >
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Dodaj itemek</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm opacity-70">Nazwa</div>
              <Input
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="np. Legendary Sword"
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm opacity-70">Estimated token value</div>
              <Input
                value={addEstimatedTokenValue}
                onChange={(e) => setAddEstimatedTokenValue(e.target.value)}
                placeholder="np. 150"
                inputMode="numeric"
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm opacity-70">Rarity</div>
              <Select
                value={String(addRarityId ?? "")}
                onValueChange={(v) => setAddRarityId(Number(v))}
                open={addRaritiesOpen}
                onOpenChange={setAddRaritiesOpen}
                disabled={!gameId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz rarity..." />
                </SelectTrigger>

                <SelectContent>
                  <div className="p-2">
                    <Input
                      value={addRaritySearch}
                      onChange={(e) => setAddRaritySearch(e.target.value)}
                      placeholder="Szukaj rarity..."
                      onKeyDown={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      disabled={!gameId}
                    />
                  </div>

                  {addRarities.length === 0 ? (
                    <div className="px-3 pb-2 text-sm opacity-70">
                      Brak wyników
                    </div>
                  ) : (
                    addRarities.map((r) => (
                      <SelectItem key={r.id} value={String(r.id)}>
                        {r.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              disabled={addSaving}
            >
              Anuluj
            </Button>
            <Button
              onClick={createItem}
              disabled={
                addSaving ||
                !addName.trim() ||
                !gameId ||
                !addRarityId ||
                !isAddTokenOk
              }
            >
              Dodaj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ItemsTab
