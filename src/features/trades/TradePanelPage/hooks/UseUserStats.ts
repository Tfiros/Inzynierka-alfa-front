import { useCallback, useEffect, useRef, useState } from "react"
import { TradeService } from "@/shared/api/services/TradeService"
import type { MiddlemanTradesStats } from "@/shared/types/tradeTypes/MiddlemanTypes"
import { extractErrorMessage } from "@/shared/utilities/errorHandlers"

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
      const res = await TradeService.getMiddlemanStats()
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
    } catch (e) {
      setState({
        stats: null,
        loadingStats: false,
        errorStats: extractErrorMessage(e, "Nie udało się pobrać statystyk."),
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
