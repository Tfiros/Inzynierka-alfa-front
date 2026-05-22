export type FavouriteSlice = {
  favouriteIds: Set<number>
  setFavouriteIds: (ids: number[]) => void
  addFavouriteId: (id: number) => void
  removeFavouriteId: (id: number) => void
}

export const createFavouriteSlice = (
  set: (fn: (state: any) => any) => void
): FavouriteSlice => ({
  favouriteIds: new Set(),
  setFavouriteIds: (ids) => set(() => ({ favouriteIds: new Set(ids) })),
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
})
