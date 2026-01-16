import { useEffect, useMemo, useState } from "react"
import useDebouncedValue from "@/shared/components/UseDebouncedValue"
import type { DropdownOption } from "@/shared/types/itemManagementTypes/DropdownTypes"
import { mapApiList } from "./MapApiList"

type Args = {
  enabled?: boolean
  open: boolean
  search: string
  delayMs?: number
  load: (q: string) => Promise<any>
  selectedId: number | null
  setSelectedId: (v: number | null) => void
}

const useDropdownQuery = ({
  enabled = true,
  open,
  search,
  delayMs = 250,
  load,
  selectedId,
  setSelectedId,
}: Args) => {
  const [items, setItems] = useState<DropdownOption[]>([])
  const [loading, setLoading] = useState(false)

  const q = useDebouncedValue({ value: search, delayMs })

  const selectedName = useMemo(() => {
    if (!selectedId) return ""
    return items.find((x) => x.id === selectedId)?.name ?? ""
  }, [items, selectedId])

  const fetch = async () => {
    if (!enabled) return

    setLoading(true)
    try {
      const res = await load((q as any) || "")
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
    if (!open) return
    void fetch()
  }, [open, q, enabled])

  return { items, loading, selectedName, refetch: fetch }
}
export default useDropdownQuery
