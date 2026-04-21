import { useCallback, useEffect, useState } from "react"
import { CounterOfferService } from "@/shared/api/services/CounterOfferService"
import type { CounterOfferListItemDto } from "@/shared/types/counterOfferTypes/CounterOfferListItemDto"
import { useAppStore } from "@/shared/store/appStore"

type Type = "sent" | "received"

export function useCounterOffers(type: Type, enabled: boolean) {
  const [data, setData] = useState<CounterOfferListItemDto[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshKey = useAppStore(
    (s) => s.counters[`counterOffers:${type}`] ?? 0
  )

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await CounterOfferService.getByType(type)

      if (!res.isSuccess) {
        setError(res.message ?? "Nie udało się pobrać kontrofert.")
        setData([])
        return
      }

      setData(res.data ?? [])
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Nie udało się pobrać kontrofert."
      setError(message)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    if (!enabled) {
      setData(null)
      setError(null)
      return
    }

    void fetch()
  }, [enabled, fetch, refreshKey])

  return { data, loading, error, refetch: fetch }
}
