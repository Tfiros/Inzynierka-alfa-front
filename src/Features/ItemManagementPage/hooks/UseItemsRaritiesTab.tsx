import { useMemo, useRef, useState } from "react"
import type { DropdownOption } from "@/shared/types/itemManagementTypes/DropdownTypes"
import { GamesService } from "@/shared/api/services/GamesService"
import { ItemRaritiesService } from "@/shared/api/services/ItemRaritiesService"
import useDropdownQuery from "./UseDropdownQuery"
import usePagedQuery from "./UsePagedQuery"

type RarityDto = { id: number; name: string }

const useItemRaritiesTab = () => {
  const pageSize = 10

  // games dropdown
  const [gamesOpen, setGamesOpen] = useState(false)
  const [gameSearch, setGameSearch] = useState("")
  const [gameId, setGameId] = useState<number | null>(null)

  const gamesDd = useDropdownQuery({
    open: gamesOpen,
    search: gameSearch,
    load: (q) => GamesService.dropdown(q),
    selectedId: gameId,
    setSelectedId: setGameId,
  })

  // list
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

  // prevent race overwrites (tak jak miałeś)
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

  // modals
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<RarityDto | null>(null)

  const selectedGameName = useMemo(
    () => gamesDd.selectedName,
    [gamesDd.selectedName]
  )

  const actions = {
    openAdd: () => setAddOpen(true),

    openEdit: (r: RarityDto) => {
      setSelected(r)
      setEditOpen(true)
    },

    openDelete: (r: RarityDto) => {
      setSelected(r)
      setDeleteOpen(true)
    },

    create: async (payload: { name: string }) => {
      if (!gameId) return
      const res = await ItemRaritiesService.create({
        gameId,
        rarityName: payload.name,
      })
      if (!res.isSuccess) {
        list.setError(res.message ?? "Nie udało się dodać rzadkości.")
        return
      }
      setAddOpen(false)
      await reloadAfterMutation()
    },

    saveEdit: async (payload: { name: string }) => {
      if (!selected) return
      const res = await ItemRaritiesService.update(selected.id, {
        rarityName: payload.name,
      })
      if (!res.isSuccess) {
        list.setError(res.message ?? "Nie udało się zapisać.")
        return
      }
      setEditOpen(false)
      setSelected(null)
      await reloadAfterMutation()
    },

    confirmDelete: async () => {
      if (!selected) return
      const res = await ItemRaritiesService.softDelete(selected.id)
      if (!res.isSuccess) {
        list.setError(res.message ?? "Nie udało się usunąć.")
        return
      }
      setDeleteOpen(false)
      setSelected(null)
      await reloadAfterMutation()
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
