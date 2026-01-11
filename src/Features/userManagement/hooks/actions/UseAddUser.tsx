import { useCallback, useState } from "react"
import { AuthService } from "@/shared/api/services/AuthService"
import type { RegisterRequestDto } from "@/shared/types/authTypes/AuthRequestTypes"
import type { ApiResult } from "@/shared/api/ApiResult"
import type { RegisterResponseDto } from "@/shared/types/authTypes/AuthResponseTypes"

const useAddUser = () => {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setSubmitting(false)
    setError(null)
  }, [])

  const addUser = useCallback(
    async (
      dto: RegisterRequestDto
    ): Promise<ApiResult<RegisterResponseDto>> => {
      setSubmitting(true)
      setError(null)

      try {
        const res = await AuthService.register(dto)

        if (!res.isSuccess) {
          setError(res.message ?? "Nie udało się dodać użytkownika.")
        }

        return res
      } catch (e: any) {
        const msg = e?.message ?? "Nie udało się dodać użytkownika."
        setError(msg)
        return { isSuccess: false, message: msg, data: undefined, status: 500 }
      } finally {
        setSubmitting(false)
      }
    },
    []
  )

  return { submitting, error, reset, addUser }
}

export default useAddUser
