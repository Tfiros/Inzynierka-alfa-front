import { useState } from "react"
import type { GenreDto } from "@/shared/types/itemManagementTypes/EntityDtos"
import { GenresService } from "@/shared/api/services/GenresService"
import usePagedQuery from "./UsePagedQuery"
import { handleError } from "@/shared/utilities/errorHandlers"

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
      try {
        const res = await GenresService.create(payload)
        if (!res?.isSuccess) {
          throw res
        }

        setAddOpen(false)
        await list.fetch()
      } catch (error) {
        handleError(error, "Błąd żądania")
      }
    },

    saveEdit: async (name: string) => {
      if (!selected) return

      try {
        const res = await GenresService.update(selected.id, { name })
        if (!res?.isSuccess) {
          throw new Error(res?.message ?? "Błąd żądania")
        }

        setEditOpen(false)
        await list.fetch()
      } catch (error) {
        handleError(error, "Błąd żądania")
      }
    },

    confirmDelete: async () => {
      if (!selected) return

      try {
        const res = await GenresService.softDelete(selected.id)
        if ((res as any)?.isSuccess === false) {
          throw new Error((res as any).message ?? "Błąd żądania")
        }

        setDeleteOpen(false)
        setSelected(null)
        await list.fetch()
      } catch (error) {
        handleError(error, "Błąd żądania")
      }
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
