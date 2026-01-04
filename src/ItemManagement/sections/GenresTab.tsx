import { useEffect, useState } from "react"
import { GenresService } from "@/api/services/GenresService"
import SearchInput from "../components/SearchInput"
import Paginator from "../components/Paginator"
import { DeleteEntityDialog } from "../components/DeleteEntityDialog"
import EditGenreDialog from "../components/EditDialogs/EditGenreDialog"
import useDebouncedValue from "../useDebouncedValue"
import EntityCard from "../components/EntityCard"
import type { GenreDto } from "@/shared/types/itemManagementTypes/EntityDtos"
import type { PagedResponse } from "@/shared/types/PagedType"
import { Button } from "@/componentsShared/button"
import AddGenreDialog from "../components/AddDialogs/AddGenreDialog"

export const GenresTab = () => {
  const [search, setSearch] = useState("")
  const q = useDebouncedValue(search, 300)

  const [page, setPage] = useState(1)
  const pageSize = 10

  const [data, setData] = useState<PagedResponse<GenreDto>>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
    elements: [],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<GenreDto | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const createGenre = async (payload: { name: string }) => {
    const res = await GenresService.create(payload)
    if (!res.isSuccess) {
      setError(res.message ?? "Nie udało się dodać gatunku.")
      return
    }
    setAddOpen(false)
    await load()
  }

  const load = async () => {
    setLoading(true)
    setError(null)

    const res = await GenresService.getPaged({
      page,
      pageSize,
      searchText: q || undefined,
    })

    setLoading(false)

    if (!res.isSuccess || !res.data) {
      setError(res.message ?? "Nie udało się pobrać gatunków.")
      setData({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 1,
        elements: [],
      })
      return
    }

    const payload = res.data

    if (!payload?.elements) {
      setError("Niepoprawny format odpowiedzi z API (brak items).")
      setData({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 1,
        elements: [],
      })
      return
    }

    setData({
      page: payload.page,
      pageSize: payload.pageSize,
      elements: payload.elements,
      totalCount: payload.totalCount ?? 0,
      totalPages: payload.totalPages ?? 1,
    })
  }

  useEffect(() => {
    setPage(1)
  }, [q])

  useEffect(() => {
    void load()
  }, [page, q])

  const items = data.elements

  const onEdit = (g: GenreDto) => {
    setSelected(g)
    setEditOpen(true)
  }

  const onDelete = (g: GenreDto) => {
    setSelected(g)
    setDeleteOpen(true)
  }

  const saveEdit = async (name: string) => {
    if (!selected) return

    const res = await GenresService.update(selected.id, { name })
    if (!res.isSuccess) {
      setError(res.message ?? "Nie udało się zapisać.")
      return
    }

    setEditOpen(false)
    await load()
  }

  const confirmDelete = async () => {
    if (!selected) return

    await GenresService.softDelete(selected.id)
    setDeleteOpen(false)
    await load()
  }

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Szukaj gatunków..."
      />

      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading && <div className="text-sm opacity-70">Ładowanie...</div>}

      {!loading && !error && items.length === 0 && (
        <div className="text-sm opacity-70">Brak wyników.</div>
      )}
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Genres</div>
        <Button onClick={() => setAddOpen(true)}>Dodaj gatunek</Button>
      </div>

      <div className="space-y-3">
        {items.map((g) => (
          <EntityCard
            key={g.id}
            title={g.name}
            id={g.id}
            onEdit={() => onEdit(g)}
            onDelete={() => onDelete(g)}
          />
        ))}
      </div>
      <AddGenreDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={createGenre}
      />

      <Paginator
        page={page}
        totalPages={data.totalPages}
        totalCount={data.totalCount}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(data.totalPages, p + 1))}
      />

      {selected && (
        <>
          <EditGenreDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            initialName={selected.name}
            onSave={saveEdit}
          />

          <DeleteEntityDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title="Usunąć gatunek?"
            description="Ta operacja ustawi IsDeleted=true. Gatunek zniknie z list, ale historia zostaje."
            onConfirm={confirmDelete}
          />
        </>
      )}
    </div>
  )
}
export default GenresTab
