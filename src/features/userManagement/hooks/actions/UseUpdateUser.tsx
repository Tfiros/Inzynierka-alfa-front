import { useCallback, useState } from "react"
import { UserManagementService } from "@/shared/api/services/UserManagementService"
import type { UpdateUserRequestDto } from "@/shared/types/userTypes/UserManagementTypes"
import type { ApiResult } from "@/shared/api/ApiResult"

const useUpdateUser = () => {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setSubmitting(false)
    setError(null)
  }, [])

  const updateUser = useCallback(
    async (dto: UpdateUserRequestDto): Promise<ApiResult<string>> => {
      setSubmitting(true)
      setError(null)

      try {
        const res = await UserManagementService.updateUser(dto)

        if (!res.isSuccess) {
          setError(res.message ?? "Nie udało się zaktualizować użytkownika.")
        }

        return res
      } catch (e: any) {
        const msg = e?.message ?? "Nie udało się zaktualizować użytkownika."
        setError(msg)
        return { isSuccess: false, message: msg, data: undefined, status: 500 }
      } finally {
        setSubmitting(false)
      }
    },
    []
  )

  return { submitting, error, reset, updateUser }
}

export default useUpdateUser
