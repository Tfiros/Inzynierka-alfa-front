import { useState } from "react"
import type { GenreDto } from "@/shared/types/itemManagementTypes/EntityDtos"
import { GenresService } from "@/shared/api/services/GenresService"
import usePagedQuery from "./UsePagedQuery"

const useGenresTab = () => {
  const [search, setSearch] = useState("")

  const list = usePagedQuery<GenreDto>({
    search,
    load: ({ page, pageSize, q }) =>
      GenresService.getPaged({
        page,
        pageSize,
        searchText: q || undefined,
      }),
  })

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<GenreDto | null>(null)

  const actions = {
    openAdd: () => setAddOpen(true),

    openEdit: (g: GenreDto) => {
      setSelected(g)
      setEditOpen(true)
    },

    openDelete: (g: GenreDto) => {
      setSelected(g)
      setDeleteOpen(true)
    },

    create: async (payload: { name: string }) => {
      const res = await GenresService.create(payload)
      if (!res.isSuccess) {
        list.setError(res.message ?? "Nie udało się dodać gatunku.")
        return
      }
      setAddOpen(false)
      await list.fetch()
    },

    saveEdit: async (name: string) => {
      if (!selected) return

      const res = await GenresService.update(selected.id, { name })
      if (!res.isSuccess) {
        list.setError(res.message ?? "Nie udało się zapisać.")
        return
      }

      setEditOpen(false)
      await list.fetch()
    },

    confirmDelete: async () => {
      if (!selected) return
      const res = await GenresService.softDelete(selected.id)

      if ((res as any)?.isSuccess === false) {
        list.setError((res as any).message ?? "Nie udało się usunąć.")
        return
      }

      setDeleteOpen(false)
      setSelected(null)
      await list.fetch()
    },
  }

  return {
    list: { search, setSearch, ...list },
    ui: {
      addOpen,
      setAddOpen,
      editOpen,
      setEditOpen,
      deleteOpen,
      setDeleteOpen,
      selected,
    },
    actions,
  }
}
export default useGenresTab
