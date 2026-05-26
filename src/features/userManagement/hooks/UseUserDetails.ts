import { useCallback, useState } from "react"
import { UserManagementService } from "@/shared/api/services/UserManagementService"
import type { UserDetailsDto } from "@/shared/types/userTypes/UserManagementTypes"

const useUserDetails = () => {
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  const resetDetailsState = useCallback(() => {
    setLoadingDetails(false)
    setDetailsError(null)
  }, [])

  const fetchUserDetails = useCallback(
    async (authZeroUserId: string): Promise<UserDetailsDto | null> => {
      if (!authZeroUserId?.trim()) {
        setDetailsError("Brak Auth0 ID użytkownika.")
        return null
      }

      setLoadingDetails(true)
      setDetailsError(null)

      try {
        const res = await UserManagementService.getUserDetails(authZeroUserId)

        if (!res.isSuccess || !res.data) {
          setDetailsError(
            res.message ?? "Nie udało się pobrać szczegółów użytkownika."
          )
          return null
        }

        return res.data
      } catch {
        setDetailsError("Nie udało się pobrać szczegółów użytkownika.")
        return null
      } finally {
        setLoadingDetails(false)
      }
    },
    []
  )

  return {
    loadingDetails,
    detailsError,
    fetchUserDetails,
    resetDetailsState,
  }
}

export default useUserDetails
