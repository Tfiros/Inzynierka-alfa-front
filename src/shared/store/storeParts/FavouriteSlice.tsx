import type { StateCreator } from "zustand"
import type { AuthSlice } from "./authSlice"
import { FavouriteService } from "@/shared/api/services/FavouriteService"
import { toast } from "sonner"

let inFlight = false

type StoreState = AuthSlice & FavouriteSlice & Record<string, unknown>

export type FavouriteSlice = {
  favouriteIds: Set<number>
  favouriteIdsLoaded: boolean
  setFavouriteIds: (ids: number[]) => void
  addFavouriteId: (id: number) => void
  removeFavouriteId: (id: number) => void
  loadFavouriteIds: () => Promise<void>
}

export const createFavouriteSlice: StateCreator<
  StoreState,
  [],
  [],
  FavouriteSlice
> = (set, get) => ({
  favouriteIds: new Set(),
  favouriteIdsLoaded: false,
  setFavouriteIds: (ids) =>
    set(() => ({ favouriteIds: new Set(ids), favouriteIdsLoaded: true })),
  addFavouriteId: (id) =>
    set((s) => {
      if (s.favouriteIds.has(id)) {
        return s
      }
      return { favouriteIds: new Set(s.favouriteIds).add(id) }
    }),
  removeFavouriteId: (id) =>
    set((s) => {
      if (!s.favouriteIds.has(id)) {
        return s
      }
      const nextIds = new Set(s.favouriteIds)
      nextIds.delete(id)
      return { favouriteIds: nextIds }
    }),
  loadFavouriteIds: async () => {
    if (inFlight) {
      return
    }

    if (!get().isAuthenticated) {
      return
    }

    if (get().favouriteIdsLoaded) {
      return
    }

    inFlight = true

    try {
      const res = await FavouriteService.getFavouriteIds()
      if (!get().isAuthenticated) {
        return
      }
      if (res.isSuccess && res.data) {
        get().setFavouriteIds(res.data)
      } else {
        toast.error(res.message ?? "Nie udało się załadować ulubionych")
      }
    } catch {
      toast.error("Nie udało się załadować ulubionych")
    } finally {
      inFlight = false
    }
  },
})
