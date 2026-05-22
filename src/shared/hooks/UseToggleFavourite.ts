import { FavouriteService } from "@/shared/api/services/FavouriteService"
import { useAppStore } from "@/shared/store/appStore"
import { useCallback, useState } from "react"
import { toast } from "sonner"

export function useToggleFavourite() {
  const [loading, setLoading] = useState(false)

  const addFavouriteId = useAppStore((s) => s.addFavouriteId)
  const removeFavouriteId = useAppStore((s) => s.removeFavouriteId)
  const inc = useAppStore((s) => s.inc)

  const toggle = useCallback(
    async (offerId: number) => {
      if (loading) {
        return
      }
      setLoading(true)
      const isCurrentlyFavourite = useAppStore
        .getState()
        .favouriteIds.has(offerId)

      const apply = (favourite: boolean) =>
        favourite ? addFavouriteId(offerId) : removeFavouriteId(offerId)

      apply(!isCurrentlyFavourite)

      try {
        const res = isCurrentlyFavourite
          ? await FavouriteService.removeFavourite(offerId)
          : await FavouriteService.addFavourite(offerId)
        if (!res.isSuccess) {
          apply(isCurrentlyFavourite)
          toast.error(res.message ?? "Nie udało się zaktualizować ulubionych")
          return
        }
        inc("favourite:list")
      } catch {
        apply(isCurrentlyFavourite)
        toast.error("Nie udało się zaktualizować ulubionych")
      } finally {
        setLoading(false)
      }
    },
    [addFavouriteId, removeFavouriteId, inc, loading]
  )

  return { toggle, loading }
}
