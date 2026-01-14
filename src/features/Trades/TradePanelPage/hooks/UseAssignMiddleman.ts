import { useCallback, useState } from "react"
import { MiddlemanService } from "@/shared/api/services/MiddlemanService"

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
        const res = await MiddlemanService.assignMiddleman({ tradeId })
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
