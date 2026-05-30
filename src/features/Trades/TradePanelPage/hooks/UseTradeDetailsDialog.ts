import { useCallback, useRef, useState } from "react"
import { TradeService } from "@/shared/api/services/TradeService"
import type {
  TradeDetailsResponse,
  TradeListItem,
} from "@/shared/types/tradeTypes/MiddlemanTypes"

type State = {
  open: boolean
  loading: boolean
  error: string | null
  trade: TradeListItem | null
  details: TradeDetailsResponse | null
}

const useTradeDetailsDialog = () => {
  const reqSeq = useRef(0)

  const [state, setState] = useState<State>({
    open: false,
    loading: false,
    error: null,
    trade: null,
    details: null,
  })

  const close = useCallback(() => {
    reqSeq.current++
    setState({
      open: false,
      loading: false,
      error: null,
      trade: null,
      details: null,
    })
  }, [])

  const openFor = useCallback(async (trade: TradeListItem) => {
    const seq = ++reqSeq.current

    setState({
      open: true,
      loading: true,
      error: null,
      trade,
      details: null,
    })

    try {
      const res = await TradeService.getMiddlemanTradeDetails(trade.tradeId)
      if (seq !== reqSeq.current) return

      const details: TradeDetailsResponse | null =
        res.isSuccess && res.data ? res.data : null

      if (!details) {
        setState((s) => ({
          ...s,
          loading: false,
          details: null,
          error: res.message ?? "Nie udało się pobrać szczegółów wymiany.",
        }))
        return
      }

      setState((s) => ({
        ...s,
        loading: false,
        details,
        error: null,
      }))
    } catch (e: any) {
      if (seq !== reqSeq.current) return
      setState((s) => ({
        ...s,
        loading: false,
        details: null,
        error: e?.message ?? "Nie udało się pobrać szczegółów wymiany.",
      }))
    }
  }, [])

  const refresh = useCallback(async () => {
    const trade = state.trade
    if (!trade) return

    const seq = ++reqSeq.current
    setState((s) => ({ ...s, loading: true, error: null }))

    try {
      const res = await TradeService.getMiddlemanTradeDetails(trade.tradeId)
      if (seq !== reqSeq.current) return

      const details: TradeDetailsResponse | null =
        res.isSuccess && res.data ? res.data : null

      if (!details) {
        setState((s) => ({
          ...s,
          loading: false,
          details: null,
          error: res.message ?? "Nie udało się pobrać szczegółów wymiany.",
        }))
        return
      }

      setState((s) => ({
        ...s,
        loading: false,
        details,
        error: null,
      }))
    } catch (e: any) {
      if (seq !== reqSeq.current) return
      setState((s) => ({
        ...s,
        loading: false,
        error: e?.message ?? "Nie udało się pobrać szczegółów wymiany.",
      }))
    }
  }, [state.trade])

  return {
    state,
    actions: {
      openFor,
      close,
      refresh,
    },
  }
}

export default useTradeDetailsDialog
