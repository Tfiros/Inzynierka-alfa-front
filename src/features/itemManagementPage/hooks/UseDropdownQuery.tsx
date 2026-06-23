import { useEffect, useMemo, useState } from "react"
import type {
  DropdownOption,
  DropdownResponse,
} from "@/shared/types/itemManagementTypes/DropdownTypes"
import { mapApiList } from "./MapApiList"
import { useDebounceValue } from "@/shared/hooks/UseDebounceValue"
import type { ApiResult } from "@/shared/api/ApiResult"

type Args = {
  enabled?: boolean
  open: boolean
  search: string
  delayMs?: number
  loadOnMount?: boolean
  load: (q: string) => Promise<ApiResult<DropdownResponse>>
  selectedId: number | null
  setSelectedId: (v: number | null) => void
}

const useDropdownQuery = ({
  enabled = true,
  open,
  search,
  delayMs = 250,
  loadOnMount = false,
  load,
  selectedId,
  setSelectedId,
}: Args) => {
  const [items, setItems] = useState<DropdownOption[]>([])
  const [loading, setLoading] = useState(false)

  const q = useDebounceValue(search, delayMs)

  const selectedName = useMemo(() => {
    if (!selectedId) return ""
    return items.find((x) => x.id === selectedId)?.name ?? ""
  }, [items, selectedId])

  const fetch = async () => {
    if (!enabled) return

    setLoading(true)
    try {
      const res = await load(q)

      if (!res?.isSuccess) {
        setItems([])
        setSelectedId(null)
        return
      }

      const list = mapApiList<DropdownOption>(res.data)
      setItems(list)

      if (list.length === 0) {
        setSelectedId(null)
        return
      }

      if (!selectedId || !list.some((x) => x.id === selectedId)) {
        setSelectedId(list[0].id)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!enabled) return
    if (!open && !loadOnMount) return

    void fetch()
  }, [open, q, enabled, loadOnMount])

  return { items, loading, selectedName, refetch: fetch }
}

export default useDropdownQuery
