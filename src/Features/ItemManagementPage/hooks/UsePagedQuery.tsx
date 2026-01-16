import { useEffect, useMemo, useState } from "react"
import useDebouncedValue from "@/shared/components/UseDebouncedValue"
import { mapApiList, mapPagedMeta } from "./MapApiList"

type Args<T> = {
  pageSize?: number
  searchDelayMs?: number
  search: string
  deps?: any[]
  enabled?: boolean
  load: (args: { page: number; pageSize: number; q?: string }) => Promise<any>
}

const usePagedQuery = <T,>({
  pageSize = 10,
  searchDelayMs = 300,
  search,
  deps = [],
  enabled = true,
  load,
}: Args<T>) => {
  const [page, setPage] = useState(1)
  const q = useDebouncedValue({ value: search, delayMs: searchDelayMs })

  const [items, setItems] = useState<T[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = async (p = page) => {
    if (!enabled) return false

    setLoading(true)
    setError(null)

    const res = await load({ page: p, pageSize, q: (q as any) || undefined })

    setLoading(false)

    if (!res?.isSuccess || !res?.data) {
      setError(res?.message ?? "Nie udało się pobrać danych.")
      setItems([])
      setTotalCount(0)
      setTotalPages(1)
      return false
    }

    setItems(mapApiList<T>(res.data))
    const meta = mapPagedMeta(res.data)
    setTotalCount(meta.totalCount)
    setTotalPages(meta.totalPages)
    return true
  }

  useEffect(() => {
    setPage(1)
  }, [q, ...deps])

  useEffect(() => {
    void fetch(page)
  }, [page, q, enabled, ...deps])

  const paginator = useMemo(
    () => ({
      page,
      totalPages,
      totalCount,
      onPrev: () => setPage((x) => Math.max(1, x - 1)),
      onNext: () => setPage((x) => Math.min(totalPages, x + 1)),
      setPage,
    }),
    [page, totalPages, totalCount]
  )

  return {
    q: (q as any) || "",
    pageSize,
    items,
    totalCount,
    totalPages,
    loading,
    error,
    setError,
    fetch,
    paginator,
  }
}
export default usePagedQuery
