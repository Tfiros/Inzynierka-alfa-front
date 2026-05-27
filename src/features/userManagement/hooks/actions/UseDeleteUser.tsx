import { useCallback, useState } from "react"
import { UserManagementService } from "@/shared/api/services/UserManagementService"
import type { ApiResult } from "@/shared/api/ApiResult"

const useDeleteUser = () => {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setSubmitting(false)
    setError(null)
  }, [])

  const deleteUser = useCallback(
    async (authZeroUserId: string): Promise<ApiResult<string>> => {
      setSubmitting(true)
      setError(null)

      try {
        const res = await UserManagementService.deleteUser({ authZeroUserId })

        if (!res.isSuccess) {
          setError(res.message ?? "Nie udało się usunąć użytkownika.")
        }

        return res
      } catch (e: any) {
        const msg = e?.message ?? "Nie udało się usunąć użytkownika."
        setError(msg)
        return { isSuccess: false, message: msg, data: msg, status: 500 }
      } finally {
        setSubmitting(false)
      }
    },
    []
  )

  return { submitting, error, reset, deleteUser }
}

export default useDeleteUser
