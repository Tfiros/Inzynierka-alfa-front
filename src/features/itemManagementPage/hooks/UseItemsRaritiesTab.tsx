import { useMemo, useRef, useState } from "react"
import type { DropdownOption } from "@/shared/types/itemManagementTypes/DropdownTypes"
import { GamesService } from "@/shared/api/services/GamesService"
import { ItemRaritiesService } from "@/shared/api/services/ItemRaritiesService"
import useDropdownQuery from "./UseDropdownQuery"
import usePagedQuery from "./UsePagedQuery"
import { handleError } from "@/shared/utilities/errorHandlers"

type RarityDto = {
  id: number
  name: string
  gameId?: number | null
}

const useItemRaritiesTab = () => {
  const pageSize = 10

  const [gamesOpen, setGamesOpen] = useState(false)
  const [gameSearch, setGameSearch] = useState("")
  const [gameId, setGameId] = useState<number | null>(null)

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<RarityDto | null>(null)

  const [dialogGamesOpen, setDialogGamesOpen] = useState(false)
  const [dialogGameSearch, setDialogGameSearch] = useState("")
  const [dialogGameId, setDialogGameId] = useState<number | null>(null)

  const gamesDd = useDropdownQuery({
    open: gamesOpen,
    search: gameSearch,
    load: (q) => GamesService.dropdown(q),
    selectedId: gameId,
    setSelectedId: setGameId,
    loadOnMount: true,
  })

  const dialogGamesDd = useDropdownQuery({
    enabled: addOpen || editOpen,
    open: dialogGamesOpen,
    search: dialogGameSearch,
    load: (q) => GamesService.dropdown(q),
    selectedId: dialogGameId,
    setSelectedId: setDialogGameId,
    loadOnMount: true,
  })

  const [search, setSearch] = useState("")

  const list = usePagedQuery<RarityDto>({
    pageSize,
    search,
    deps: [gameId],
    enabled: !!gameId,
    load: ({ page, pageSize, q }) =>
      ItemRaritiesService.getPaged({
        page,
        pageSize,
        gameId: gameId!,
        searchText: q || undefined,
      }),
  })

  const loadSeq = useRef(0)

  const fetchWithSeq = async (p: number) => {
    const my = ++loadSeq.current
    const ok = await list.fetch(p)

    if (my !== loadSeq.current) return { ok: false, ignored: true }

    return { ok, ignored: false }
  }

  const reloadAfterMutation = async () => {
    if (!gameId) return

    const first = await fetchWithSeq(list.paginator.page)

    if (first.ok || first.ignored) return

    if (list.paginator.page > 1) {
      const newPage = list.paginator.page - 1

      list.paginator.setPage(newPage)

      await fetchWithSeq(newPage)
    }
  }

  const selectedGameName = useMemo(
    () => gamesDd.selectedName,
    [gamesDd.selectedName]
  )

  const resetDialogGame = (id: number | null) => {
    setDialogGameId(id)
    setDialogGameSearch("")
    setDialogGamesOpen(false)
  }

  const actions = {
    openAdd: () => {
      resetDialogGame(gameId)
      setAddOpen(true)
    },

    openEdit: (r: RarityDto) => {
      setSelected(r)
      resetDialogGame(r.gameId ?? gameId)
      setEditOpen(true)
    },

    openDelete: (r: RarityDto) => {
      setSelected(r)
      setDeleteOpen(true)
    },

    create: async (payload: { name: string; gameId: number }) => {
      try {
        const res = await ItemRaritiesService.create({
          gameId: payload.gameId,
          rarityName: payload.name,
        })

        if (!res?.isSuccess) {
          throw new Error(res?.message ?? "Błąd żądania")
        }

        setAddOpen(false)
        await reloadAfterMutation()
      } catch (error) {
        handleError(error, "Błąd żądania")
      }
    },

    saveEdit: async (payload: { name: string; gameId: number }) => {
      if (!selected) return

      try {
        const res = await ItemRaritiesService.update(selected.id, {
          rarityName: payload.name,
        })

        if (!res?.isSuccess) {
          throw new Error(res?.message ?? "Błąd żądania")
        }

        setEditOpen(false)
        setSelected(null)

        await reloadAfterMutation()
      } catch (error) {
        handleError(error, "Błąd żądania")
      }
    },

    confirmDelete: async () => {
      if (!selected) return

      try {
        const res = await ItemRaritiesService.softDelete(selected.id)

        if (res?.isSuccess === false) {
          throw new Error(res.message ?? "Błąd żądania")
        }

        setDeleteOpen(false)
        setSelected(null)

        await reloadAfterMutation()
      } catch (error) {
        handleError(error, "Błąd żądania")
      }
    },
  }

  return {
    game: {
      id: gameId,
      setId: setGameId,
      open: gamesOpen,
      setOpen: setGamesOpen,
      search: gameSearch,
      setSearch: setGameSearch,
      items: gamesDd.items as DropdownOption[],
      selectedName: selectedGameName,
    },

    dialogGame: {
      id: dialogGameId,
      setId: setDialogGameId,
      open: dialogGamesOpen,
      setOpen: setDialogGamesOpen,
      search: dialogGameSearch,
      setSearch: setDialogGameSearch,
      items: dialogGamesDd.items as DropdownOption[],
      selectedName: dialogGamesDd.selectedName,
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

export default useItemRaritiesTab
