import { useCallback, useEffect, useState } from "react"
import { ItemRaritiesService } from "@/shared/api/services/ItemRaritiesService"
import type { DropdownOption } from "@/shared/types/itemManagementTypes/DropdownTypes"

export const useRaritiesDropdown = (
  gameId: number,
  search: string,
  enabled = true
) => {
  const [rarities, setRarities] = useState<DropdownOption[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    try {
      const res = await ItemRaritiesService.dropdown(
        gameId,
        search.trim() || ""
      )
      if (!res?.isSuccess) {
        setRarities([])
        return
      }

      const d = res?.data
      const list = ((d?.items ?? d) as DropdownOption[]) ?? []
      setRarities(list)
    } finally {
      setLoading(false)
    }
  }, [gameId, search, enabled])

  useEffect(() => {
    void load()
  }, [load])

  return { rarities, loading, refresh: load }
}

export default useRaritiesDropdown
