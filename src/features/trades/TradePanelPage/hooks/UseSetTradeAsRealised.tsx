import { toast } from "sonner"
import { useCallback, useMemo, useState } from "react"
import type { ApiResult } from "@/shared/api/ApiResult"
import { TradeService } from "@/shared/api/services/TradeService"
import type {
  CompleteAndMarkTradeRequest,
  InTradeUser,
  TradeListItem,
} from "@/shared/types/tradeTypes/MiddlemanTypes"
import { extractErrorMessage } from "@/shared/utilities/errorHandlers"

type Props = {
  onSuccess?: () => void
  onError?: (err: unknown) => void
  successMessage?: string
}

type UserLite = {
  id: number
  nickname?: string | null
  email?: string | null
}

const clamp10 = (v: number) => Math.max(0, Math.min(10, v))

function mapParty(party: InTradeUser | undefined): UserLite | null {
  if (!party) return null

  return {
    id: party.userId,
    nickname: party.nickname,
    email: party.email,
  }
}

function extractBuyer(trade: TradeListItem | null): UserLite | null {
  return mapParty(trade?.customer)
}

function extractSeller(trade: TradeListItem | null): UserLite | null {
  return mapParty(trade?.postingUser)
}

const useSetTradeAsRealised = (opts?: Props) => {
  const [open, setOpen] = useState(false)
  const [trade, setTrade] = useState<TradeListItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const buyer = useMemo(() => extractBuyer(trade), [trade])
  const seller = useMemo(() => extractSeller(trade), [trade])

  const actions = useMemo(
    () => ({
      openFor: (t: TradeListItem) => {
        setTrade(t)
        setOpen(true)
      },
      close: () => {
        setOpen(false)
        setTrade(null)
      },
      setOpen,
    }),
    []
  )

  const confirm = useCallback(
    async (payload: CompleteAndMarkTradeRequest) => {
      const tradeId = trade?.tradeId

      if (!tradeId) {
        toast.error("Brak ID wymiany.")
        return
      }

      if (!buyer?.id || !seller?.id) {
        toast.error("Brak danych kupującego lub wystawiającego.")
        return
      }

      const safePayload: CompleteAndMarkTradeRequest = {
        ...payload,
        buyersID: buyer.id,
        sellersID: seller.id,
        buyersGrade: clamp10(payload.buyersGrade),
        sellersGrade: clamp10(payload.sellersGrade),
        buyersDescription: payload.buyersDescription?.trim(),
        sellersDescription: payload.sellersDescription?.trim(),
      }

      setIsLoading(true)
      try {
        const res = (await TradeService.setTradeAsRealised(
          tradeId,
          safePayload
        )) as ApiResult<number>

        if (res && res.status && res.status !== 200) {
          toast.error(res.message ?? "Wystąpił błąd serwera.")
          opts?.onError?.(res)
          setIsLoading(false)
          return
        }

        if (!res?.isSuccess) {
          throw new Error(res?.message || "Request failed")
        }

        toast.success(opts?.successMessage ?? "Wymiana została zakończona.")
        actions.close()
        opts?.onSuccess?.()
      } catch (e) {
        const msg = extractErrorMessage(
          e,
          "Nie udało się potwierdzić zakończenia wymiany."
        )
        toast.error(msg)
        opts?.onError?.(e)
      } finally {
        setIsLoading(false)
      }
    },
    [trade, buyer?.id, seller?.id, opts, actions]
  )

  return {
    state: { open, trade, buyer, seller },
    isLoading,
    actions: {
      ...actions,
      confirm,
    },
  }
}

export default useSetTradeAsRealised
