import { useCallback, useEffect, useRef, useState } from "react"
import { MiddlemanService } from "@/shared/api/services/MiddlemanService"
import type { MiddlemanTradesStats } from "@/shared/types/tradeTypes/MiddlemanTypes"

type State = {
  stats: MiddlemanTradesStats | null
  loadingStats: boolean
  errorStats: string | null
}

const useUserStats = () => {
  const loadedRef = useRef(false)

  const [state, setState] = useState<State>({
    stats: null,
    loadingStats: true,
    errorStats: null,
  })

  const fetchStats = useCallback(async () => {
    setState((s) => ({ ...s, loadingStats: true, errorStats: null }))

    try {
      const res = await MiddlemanService.getMiddlemanStats()
      if (!res.isSuccess || !res.data) {
        setState({
          stats: null,
          loadingStats: false,
          errorStats: res.message ?? "Nie udało się pobrać statystyk.",
        })
        return
      }

      setState({
        stats: res.data ?? null,
        loadingStats: false,
        errorStats: null,
      })
    } catch (e: any) {
      setState({
        stats: null,
        loadingStats: false,
        errorStats: e?.message ?? "Nie udało się pobrać statystyk.",
      })
    }
  }, [])

  const fetchOnce = useCallback(async () => {
    if (loadedRef.current) return
    loadedRef.current = true
    await fetchStats()
  }, [fetchStats])

  useEffect(() => {
    void fetchOnce()
  }, [fetchOnce])

  return {
    ...state,
    refetchStats: fetchStats,
  }
}

export default useUserStats
