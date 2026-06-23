import { useMemo, useState } from "react"
import type { DropdownOption } from "@/shared/types/itemManagementTypes/DropdownTypes"
import type { GameDto } from "@/shared/types/itemManagementTypes/EntityDtos"
import { GenresService } from "@/shared/api/services/GenresService"
import { GamesService } from "@/shared/api/services/GamesService"
import useDropdownQuery from "./UseDropdownQuery"
import usePagedQuery from "./UsePagedQuery"
import { handleError } from "@/shared/utilities/errorHandlers"

export type AddGamePayload = {
  name: string
  genreId: number
  itemRaritiesNames: string[]
  image: File | null
}

const useGamesTab = () => {
  const [genresOpen, setGenresOpen] = useState(false)
  const [genreSearch, setGenreSearch] = useState("")
  const [genreId, setGenreId] = useState<number | null>(null)

  const genresDd = useDropdownQuery({
    open: genresOpen,
    search: genreSearch,
    load: (q) => GenresService.dropdown(q),
    selectedId: genreId,
    setSelectedId: setGenreId,
    loadOnMount: true,
  })

  const selectedGenreName = useMemo(
    () => genresDd.selectedName,
    [genresDd.selectedName]
  )

  const [search, setSearch] = useState("")

  const list = usePagedQuery<GameDto>({
    search,
    deps: [genreId],
    enabled: !!genreId,
    load: ({ page, pageSize, q }) =>
      GamesService.getPaged({
        page,
        pageSize,
        genreId: genreId!,
        searchText: q || undefined,
      }),
  })

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<
    (GameDto & { genreId: number }) | null
  >(null)

  const actions = {
    openAdd: () => setAddOpen(true),

    openEdit: (g: GameDto) => {
      if (!genreId) return
      setSelected({ ...g, genreId })
      setEditOpen(true)
    },

    openDelete: (g: GameDto) => {
      if (!genreId) return
      setSelected({ ...g, genreId })
      setDeleteOpen(true)
    },

    create: async (payload: AddGamePayload) => {
      console.log("CREATE CLICKED", payload)

      try {
        const res = await GamesService.create(payload)

        if (!res?.isSuccess) {
          throw res
        }

        setAddOpen(false)
        await list.fetch()
      } catch (error) {
        handleError(error, "Błąd żądania")
      }
    },

    saveEdit: async (payload: {
      name?: string
      genreId?: number
      image?: File | null
    }) => {
      if (!selected) return

      try {
        const res = await GamesService.update(selected.id, payload)
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
        const res = await GamesService.softDelete(selected.id)
        if (res?.isSuccess === false) {
          throw new Error(res.message ?? "Błąd żądania")
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
    genre: {
      id: genreId,
      setId: setGenreId,
      open: genresOpen,
      setOpen: setGenresOpen,
      search: genreSearch,
      setSearch: setGenreSearch,
      items: genresDd.items as DropdownOption[],
      selectedName: selectedGenreName,
    },
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
export default useGamesTab
