import { useCallback, useState } from "react"
import { TradeService } from "@/shared/api/services/TradeService"

type Args = {
  onSuccessRefetch: () => void | Promise<void>
}

const useAssignMiddleman = ({ onSuccessRefetch }: Args) => {
  const [assigning, setAssigning] = useState(false)
  const [assignError, setAssignError] = useState<string | null>(null)

  const assignToMe = useCallback(
    async (tradeId: number) => {
      setAssigning(true)
      setAssignError(null)
      try {
        const res = await TradeService.assignMiddleman({ tradeId })
        if (!res.isSuccess) {
          setAssignError(res.message ?? "Nie udało się przypisać wymiany.")
          return
        }
        await onSuccessRefetch()
      } finally {
        setAssigning(false)
      }
    },
    [onSuccessRefetch]
  )

  return { assigning, assignError, assignToMe }
}

export default useAssignMiddleman
