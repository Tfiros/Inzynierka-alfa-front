import { useEffect, useMemo, useState } from "react"
import useDebouncedValue from "../useDebouncedValue"
import SearchInput from "../components/SearchInput"
import Paginator from "../components/Paginator"
import EntityCard from "../components/EntityCard"
import { DeleteEntityDialog } from "../components/DeleteEntityDialog"
import EditGameDialog from "../components/EditDialogs/EditGameDialog"

import { Input } from "@/shared/components/Input"
import { Button } from "@/shared/components/Button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/Dialog"
import type { DropdownOption } from "@/shared/types/itemManagementTypes/DropdownTypes"
import type { GameDto } from "@/shared/types/itemManagementTypes/EntityDtos"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/Select"
import { GenresService } from "@/shared/api/services/GenresService"
import { GamesService } from "@/shared/api/services/GamesService"

const GamesTab = () => {
  const [genres, setGenres] = useState<DropdownOption[]>([])
  const [genreId, setGenreId] = useState<number | null>(null)

  const [genresOpen, setGenresOpen] = useState(false)
  const [genreSearch, setGenreSearch] = useState("")
  const genreQ = useDebouncedValue(genreSearch, 250)

  const [search, setSearch] = useState("")
  const q = useDebouncedValue(search, 300)

  const [page, setPage] = useState(1)
  const pageSize = 10

  const [data, setData] = useState<{
    items: GameDto[]
    totalCount: number
    totalPages: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<
    (GameDto & { genreId?: number }) | null
  >(null)

  const [addOpen, setAddOpen] = useState(false)
  const [addName, setAddName] = useState("")
  const [addSaving, setAddSaving] = useState(false)
  const [addRarityInput, setAddRarityInput] = useState("")
  const [addRarities, setAddRarities] = useState<string[]>([])

  const extractDropdownItems = (res: any): DropdownOption[] => {
    const d = res?.data
    if (!d) return []
    return (d?.items ?? d?.elements ?? []) as DropdownOption[]
  }

  const loadGenres = async () => {
    try {
      const res = await GenresService.dropdown(genreQ || "")
      if (!res?.isSuccess) {
        setGenres([])
        setGenreId(null)
        return
      }

      const list = extractDropdownItems(res)
      setGenres(list)

      if (list.length === 0) {
        setGenreId(null)
        return
      }

      if (!genreId || !list.some((x) => x.id === genreId)) {
        setGenreId(list[0].id)
      }
    } catch {
      setGenres([])
      setGenreId(null)
    }
  }

  const loadGames = async () => {
    if (!genreId) return

    setLoading(true)
    setError(null)

    const res = await GamesService.getPaged({
      page,
      pageSize,
      genreId,
      searchText: q || undefined,
    })

    setLoading(false)

    if (!res.isSuccess || !res.data) {
      setError(res.message ?? "Nie udało się pobrać gier.")
      setData({ items: [], totalCount: 0, totalPages: 1 })
      return
    }

    setData({
      items: (res.data as any).items ?? (res.data as any).elements ?? [],
      totalCount: res.data.totalCount ?? 0,
      totalPages: res.data.totalPages ?? 1,
    })
  }

  useEffect(() => {
    if (!genresOpen) return
    void loadGenres()
  }, [genresOpen, genreQ])

  useEffect(() => {
    setPage(1)
  }, [q, genreId])

  useEffect(() => {
    void loadGames()
  }, [page, q, genreId])

  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1
  const items = data?.items ?? []

  const selectedGenreName = useMemo(
    () => (genreId ? (genres.find((x) => x.id === genreId)?.name ?? "") : ""),
    [genreId, genres]
  )

  const onEdit = (g: GameDto) => {
    setSelected({ ...g, genreId: genreId ?? 0 })
    setEditOpen(true)
  }

  const onDelete = (g: GameDto) => {
    setSelected({ ...g, genreId: genreId ?? 0 })
    setDeleteOpen(true)
  }

  const saveEdit = async (payload: { name?: string; genreId?: number }) => {
    if (!selected) return
    const res = await GamesService.update(selected.id, payload)
    if (!res.isSuccess) {
      setError(res.message ?? "Nie udało się zapisać.")
      return
    }
    setEditOpen(false)
    await loadGames()
  }

  const confirmDelete = async () => {
    if (!selected) return

    setError(null)
    try {
      await GamesService.softDelete(selected.id)

      setDeleteOpen(false)
      setSelected(null)
      await loadGames()
    } catch (e: any) {
      setError(e?.message ?? "Nie udało się usunąć.")
    }
  }
  const addRarity = () => {
    const value = addRarityInput.trim()
    if (!value) return

    const exists = addRarities.some(
      (r) => r.toLowerCase() === value.toLowerCase()
    )
    if (exists) return

    setAddRarities((prev) => [...prev, value])
    setAddRarityInput("")
  }

  const removeRarity = (value: string) => {
    setAddRarities((prev) => prev.filter((r) => r !== value))
  }

  const createGame = async () => {
    const name = addName.trim()
    if (!name || !genreId) return

    const itemRaritiesNames = addRarities.map((r) => r.trim()).filter(Boolean)

    setAddSaving(true)
    setError(null)

    try {
      const res = await GamesService.create({
        name,
        genreId,
        itemRaritiesNames,
      })
      if (!res.isSuccess) {
        setError(res.message ?? "Nie udało się dodać gry.")
        return
      }

      setAddOpen(false)
      setAddName("")
      setAddRarityInput("")
      setAddRarities([])
      await loadGames()
    } finally {
      setAddSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <Select
        value={String(genreId ?? "")}
        onValueChange={(v) => setGenreId(Number(v))}
        open={genresOpen}
        onOpenChange={setGenresOpen}
      >
        <SelectTrigger>
          <SelectValue placeholder="Wybierz gatunek..." />
        </SelectTrigger>

        <SelectContent>
          <div className="p-2">
            <Input
              value={genreSearch}
              onChange={(e) => setGenreSearch(e.target.value)}
              placeholder="Szukaj gatunku..."
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            />
          </div>

          {genres.length === 0 ? (
            <div className="px-3 pb-2 text-sm opacity-70">Brak wyników</div>
          ) : (
            genres.map((g) => (
              <SelectItem key={g.id} value={String(g.id)}>
                {g.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm opacity-70">
          {genreId ? `Gatunek: ${selectedGenreName}` : "Wybierz gatunek"}
        </div>
        <Button
          onClick={() => {
            setAddName("")
            setAddRarityInput("")
            setAddRarities([])
            setAddOpen(true)
          }}
          disabled={!genreId}
        >
          Dodaj grę
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Szukaj gier..."
      />

      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading && <div className="text-sm opacity-70">Ładowanie...</div>}

      <div className="space-y-3">
        {items.map((g) => (
          <EntityCard
            key={g.id}
            title={g.name}
            metaLeft={genreId ? `Gatunek: ${selectedGenreName}` : undefined}
            id={g.id}
            onEdit={() => onEdit(g)}
            onDelete={() => onDelete(g)}
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
          <EditGameDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            initialName={selected.name}
            initialGenreId={selected.genreId ?? genreId ?? 0}
            genres={genres}
            onSave={saveEdit}
          />

          <DeleteEntityDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title="Usunąć grę?"
            description="Ta operacja ustawi IsDeleted=true. Gra zniknie z list, ale historia zostaje."
            onConfirm={confirmDelete}
          />
        </>
      )}

      <Dialog
        open={addOpen}
        onOpenChange={(v) => {
          setAddOpen(v)
          if (!v) {
            setAddName("")
            setAddRarityInput("")
            setAddRarities([])
          }
        }}
      >
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Dodaj grę</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <div className="text-sm opacity-70">Nazwa</div>
            <Input
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              placeholder="np. Witcher 3"
            />
            <div className="text-xs opacity-60">
              Gatunek: {selectedGenreName}
            </div>
            <div className="space-y-2">
              <div className="text-sm opacity-70">Item rarities</div>

              <div className="flex gap-2">
                <Input
                  value={addRarityInput}
                  onChange={(e) => setAddRarityInput(e.target.value)}
                  placeholder="np. Common / Rare / Epic"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addRarity()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addRarity}
                  disabled={addSaving || !addRarityInput.trim()}
                >
                  Dodaj
                </Button>
              </div>

              {addRarities.length > 0 && (
                <div className="space-y-2 rounded-xl border p-3">
                  <div className="text-xs opacity-60">
                    Dodane ({addRarities.length})
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {addRarities.map((r) => (
                      <div
                        key={r}
                        className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
                      >
                        <span>{r}</span>
                        <button
                          type="button"
                          className="opacity-60 hover:opacity-100"
                          onClick={() => removeRarity(r)}
                          aria-label={`Usuń rarity ${r}`}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              onClick={createGame}
              disabled={addSaving || !addName.trim() || !genreId}
            >
              Dodaj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GamesTab
