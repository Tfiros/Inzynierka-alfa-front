import { toast } from "sonner"
import type { ApiResult } from "@/shared/api/ApiResult"
import { useCallback, useState } from "react"
import { MiddlemanService } from "@/shared/api/services/MiddlemanService"

type Options = {
  onSuccess?: () => void
  onError?: (err: unknown) => void
  successMessage?: string
}

function getErrorMessage(e: unknown) {
  if (typeof e === "object" && e && "message" in e) {
    const msg = (e as any).message
    if (typeof msg === "string" && msg.trim()) return msg
  }
  return "Nie udało się potwierdzić zakończenia wymiany."
}

const useSetTradeAsRealised = (tradeId: number | null, opts?: Options) => {
  const [isLoading, setIsLoading] = useState(false)

  const realise = useCallback(async () => {
    if (!tradeId) {
      toast.error("Brak ID wymiany.")
      return
    }

    setIsLoading(true)
    try {
      const res = (await MiddlemanService.setTradeAsRealised(
        tradeId
      )) as ApiResult<number>

      if (!res?.isSuccess) {
        throw new Error(res?.message || "Request failed")
      }

      toast.success(opts?.successMessage ?? "Wymiana została zakończona.")
      opts?.onSuccess?.()
    } catch (e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
      opts?.onError?.(e)
    } finally {
      setIsLoading(false)
    }
  }, [tradeId, opts])

  return { realise, isLoading }
}

export default useSetTradeAsRealised
