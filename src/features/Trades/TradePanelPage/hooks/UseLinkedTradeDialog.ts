import { TradeService } from "@/shared/api/services/TradeService"
import type { TradeListItem } from "@/shared/types/tradeTypes/MiddlemanTypes"
import { useCallback, useRef, useState } from "react"

type State = {
  open: boolean
  loading: boolean
  error: string | null
  trade: TradeListItem | null
}

const getErrorMessage = (e: unknown) => {
  if (e instanceof Error && e.message.trim()) return e.message
  return "Nie udało się załadować wymiany."
}

const useLinkedTradeDialog = () => {
  const reqRef = useRef(0)
  const [state, setState] = useState<State>({
    open: false,
    loading: false,
    error: null,
    trade: null,
  })

  const close = useCallback(() => {
    reqRef.current++
    setState({
      open: false,
      loading: false,
      error: null,
      trade: null,
    })
  }, [])

  const openForId = useCallback(async (tradeId: number) => {
    if (!Number.isFinite(tradeId) || tradeId <= 0) return

    const seq = ++reqRef.current
    setState({ open: true, loading: true, error: null, trade: null })
    try {
      const res = await TradeService.getById(tradeId)
      if (seq !== reqRef.current) return

      const trade = res.isSuccess && res.data ? res.data : null
      setState({
        open: true,
        loading: false,
        error: trade ? null : (res.message ?? "Nie udało się pobrać wymiany."),
        trade: trade,
      })
    } catch (e: unknown) {
      if (seq !== reqRef.current) return
      setState({
        open: true,
        loading: false,
        error: getErrorMessage(e),
        trade: null,
      })
    }
  }, [])
  return { state, openForId, close }
}

export default useLinkedTradeDialog
