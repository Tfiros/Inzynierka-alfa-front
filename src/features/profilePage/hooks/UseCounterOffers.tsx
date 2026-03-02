import { useCallback, useEffect, useState } from "react"
import { get } from "@/shared/api/ApiClient"
import type { ApiResult } from "@/shared/api/ApiResult"
import type { CounterOfferListItemDto } from "@/shared/types/counterOfferTypes/CounterOfferListItemDto"

type Type = "sent" | "received"

export function useCounterOffers(type: Type, enabled: boolean) {
  const [data, setData] = useState<CounterOfferListItemDto[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res: ApiResult<CounterOfferListItemDto[]> = await get(
        `/CounterOffers/${type}`
      )

      if (!res.isSuccess) {
        setError(res.message ?? "Nie udało się pobrać kontrofert.")
        setData([])
        return
      }

      setData(res.data ?? [])
    } catch (e: any) {
      setError(e?.message ?? "Request failed")
      setData([])
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    if (!enabled) return
    void fetch()
  }, [enabled, fetch])

  return { data, loading, error, refetch: fetch }
}
