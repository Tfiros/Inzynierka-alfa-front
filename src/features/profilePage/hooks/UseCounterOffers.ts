import { useCallback, useEffect, useState } from "react"
import { CounterOfferService } from "@/shared/api/services/CounterOfferService"
import type { CounterOfferListItemDto } from "@/shared/types/counterOfferTypes/CounterOfferListItemDto"
import type { PagedResponse } from "@/shared/types/PagedType"
import { selectCounter, useAppStore } from "@/shared/store/appStore"

type Type = "sent" | "received"

export function useCounterOffers(
  type: Type,
  enabled: boolean,
  page = 1,
  pageSize = 10,
  orderBy = 2
) {
  const [data, setData] =
    useState<PagedResponse<CounterOfferListItemDto> | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshKey = useAppStore(selectCounter(`counterOffers:${type}`))

  const emptyPage: PagedResponse<CounterOfferListItemDto> = {
    page,
    pageSize,
    totalCount: 0,
    totalPages: 1,
    elements: [],
  }

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await CounterOfferService.getByType(type, {
        page,
        pageSize,
        orderBy,
      })

      if (!res.isSuccess || !res.data) {
        setError(res.message ?? "Nie udało się pobrać kontrofert.")
        setData(emptyPage)
        return
      }

      setData(res.data)
    } catch {
      setError("Nie udało się pobrać kontrofert.")
      setData(emptyPage)
    } finally {
      setLoading(false)
    }
  }, [type, page, pageSize, orderBy])

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
