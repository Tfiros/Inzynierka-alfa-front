import { useMemo, useState } from "react"
import type { DropdownOption } from "@/shared/types/itemManagementTypes/DropdownTypes"
import type { ItemDto } from "@/shared/types/itemManagementTypes/EntityDtos"
import { GamesService } from "@/shared/api/services/GamesService"
import { ItemRaritiesService } from "@/shared/api/services/ItemRaritiesService"
import { ItemsService } from "@/shared/api/services/ItemsService"
import useDropdownQuery from "./UseDropdownQuery"
import usePagedQuery from "./UsePagedQuery"
import { handleError } from "@/shared/utilities/errorHandlers"

const useItemsTab = () => {
  const [gamesOpen, setGamesOpen] = useState(false)
  const [gameSearch, setGameSearch] = useState("")
  const [gameId, setGameId] = useState<number | null>(null)

  const gamesDd = useDropdownQuery({
    open: gamesOpen,
    search: gameSearch,
    load: (q) => GamesService.dropdown(q),
    selectedId: gameId,
    setSelectedId: setGameId,
    loadOnMount: true,
  })

  const [search, setSearch] = useState("")

  const list = usePagedQuery<ItemDto>({
    search,
    deps: [gameId],
    enabled: !!gameId,
    load: ({ page, pageSize, q }) =>
      ItemsService.getPaged({
        page,
        pageSize,
        gameId: gameId!,
        searchText: q || undefined,
      }),
  })

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<ItemDto | null>(null)

  const [addOpen, setAddOpen] = useState(false)
  const [addSaving, setAddSaving] = useState(false)
  const [addName, setAddName] = useState("")
  const [addEstimatedTokenValue, setAddEstimatedTokenValue] = useState("")
  const [addImage, setAddImage] = useState<File | null>(null)

  const [addGamesOpen, setAddGamesOpen] = useState(false)
  const [addGameSearch, setAddGameSearch] = useState("")
  const [addGameId, setAddGameIdState] = useState<number | null>(null)

  const [raritiesOpen, setRaritiesOpen] = useState(false)
  const [raritySearch, setRaritySearch] = useState("")
  const [rarityId, setRarityId] = useState<number | null>(null)

  const addGamesDd = useDropdownQuery({
    enabled: addOpen,
    open: addGamesOpen,
    search: addGameSearch,
    load: (q) => GamesService.dropdown(q),
    selectedId: addGameId,
    setSelectedId: setAddGameIdState,
    loadOnMount: true,
  })

  const setAddGameId = (id: number | null) => {
    setAddGameIdState(id)
    setRarityId(null)
    setRaritySearch("")
    setRaritiesOpen(false)
  }

  const raritiesDd = useDropdownQuery({
    enabled: !!addGameId && addOpen,
    open: raritiesOpen,
    search: raritySearch,
    load: (q) => ItemRaritiesService.dropdown(addGameId!, q),
    selectedId: rarityId,
    setSelectedId: setRarityId,
  })

  const resetAdd = () => {
    setAddName("")
    setAddEstimatedTokenValue("")
    setAddImage(null)

    setAddGameIdState(gameId)
    setAddGameSearch("")
    setAddGamesOpen(false)

    setRaritySearch("")
    setRarityId(null)
    setRaritiesOpen(false)
  }

  const isAddTokenOk = useMemo(() => {
    const v = addEstimatedTokenValue.trim()
    if (!v) return false
    const n = Number(v)
    return Number.isFinite(n) && n >= 0
  }, [addEstimatedTokenValue])

  const actions = {
    openAdd: () => {
      resetAdd()
      setAddOpen(true)
    },

    openEdit: (i: ItemDto) => {
      setSelected(i)
      setEditOpen(true)
    },

    openDelete: (i: ItemDto) => {
      setSelected(i)
      setDeleteOpen(true)
    },

    saveEdit: async (payload: {
      name: string
      estimatedTokenValue: number
      gameId: number
      itemRarityId: number
      image?: File | null
    }) => {
      if (!selected) return

      try {
        const res = await ItemsService.update(selected.id, payload)
        if (!res?.isSuccess) {
          throw new Error(res?.message ?? "Błąd żądania")
        }

        setEditOpen(false)
        setSelected(null)
        await list.fetch()
      } catch (error) {
        handleError(error, "Błąd żądania")
      }
    },

    confirmDelete: async () => {
      if (!selected) return

      try {
        const res = await ItemsService.softDelete(selected.id)
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

    create: async () => {
      const name = addName.trim()
      if (!name || !addGameId || !rarityId) return

      const token = Number(addEstimatedTokenValue)
      if (!Number.isFinite(token) || token < 0) return

      setAddSaving(true)
      list.setError(null)

      try {
        const res = await ItemsService.create({
          name,
          estimatedTokenValue: token,
          gameId: addGameId,
          itemRarityId: rarityId,
          image: addImage,
        })

        if (!res?.isSuccess) {
          throw new Error(res?.message ?? "Błąd żądania")
        }

        setAddOpen(false)
        resetAdd()
        await list.fetch()
      } catch (error) {
        handleError(error, "Błąd żądania")
      } finally {
        setAddSaving(false)
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
      selectedName: gamesDd.selectedName,
    },

    list: { search, setSearch, ...list },

    edit: { editOpen, setEditOpen, deleteOpen, setDeleteOpen, selected },

    add: {
      open: addOpen,
      setOpen: setAddOpen,
      saving: addSaving,

      game: {
        id: addGameId,
        setId: setAddGameId,
        open: addGamesOpen,
        setOpen: setAddGamesOpen,
        search: addGameSearch,
        setSearch: setAddGameSearch,
        items: addGamesDd.items as DropdownOption[],
        loading: addGamesDd.loading,
      },

      name: addName,
      setName: setAddName,
      token: addEstimatedTokenValue,
      setToken: setAddEstimatedTokenValue,
      isTokenOk: isAddTokenOk,
      image: addImage,
      setImage: setAddImage,

      rarity: {
        id: rarityId,
        setId: setRarityId,
        open: raritiesOpen,
        setOpen: setRaritiesOpen,
        search: raritySearch,
        setSearch: setRaritySearch,
        items: raritiesDd.items as DropdownOption[],
        loading: raritiesDd.loading,
      },
    },

    actions,
  }
}

export default useItemsTab
