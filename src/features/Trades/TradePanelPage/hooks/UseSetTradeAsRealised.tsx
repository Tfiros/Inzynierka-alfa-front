import { toast } from "sonner"
import { useCallback, useMemo, useState } from "react"
import type { ApiResult } from "@/shared/api/ApiResult"
import { MiddlemanService } from "@/shared/api/services/MiddlemanService"
import type {
  CompleteAndMarkTradeRequest,
  TradeListItem,
} from "@/shared/types/tradeTypes/MiddlemanTypes"

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

function getErrorMessage(e: unknown) {
  if (typeof e === "object" && e && "message" in e) {
    const msg = (e as any).message
    if (typeof msg === "string" && msg.trim()) return msg
  }
  return "Nie udało się potwierdzić zakończenia wymiany."
}

const clamp10 = (v: number) => Math.max(0, Math.min(10, v))

function pickFirst<T>(obj: any, keys: string[]): T | undefined {
  for (const k of keys) {
    const v = obj?.[k]
    if (v !== undefined && v !== null) return v as T
  }
  return undefined
}

function mapParty(party: any): UserLite | null {
  if (!party) return null

  const id =
    pickFirst<number>(party, ["id", "userId", "ID", "userID"]) ??
    (typeof party === "number" ? party : undefined)

  if (!id) return null

  return {
    id,
    nickname: pickFirst<string>(party, [
      "nickname",
      "userName",
      "username",
      "name",
      "displayName",
    ]),
    email: pickFirst<string>(party, ["email", "mail"]),
  }
}

function extractBuyer(trade: TradeListItem | null): UserLite | null {
  return mapParty((trade as any)?.customer)
}

function extractSeller(trade: TradeListItem | null): UserLite | null {
  return mapParty((trade as any)?.postingUser)
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
      const tradeId = (trade as any)?.tradeId as number | undefined

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
        const res = (await MiddlemanService.setTradeAsRealised(
          tradeId,
          safePayload
        )) as ApiResult<number>

        if (!res?.isSuccess) {
          throw new Error(res?.message || "Request failed")
        }

        toast.success(opts?.successMessage ?? "Wymiana została zakończona.")
        actions.close()
        opts?.onSuccess?.()
      } catch (e) {
        const msg = getErrorMessage(e)
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
