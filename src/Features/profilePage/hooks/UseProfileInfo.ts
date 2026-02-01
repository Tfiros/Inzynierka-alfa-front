import type { ApiResult } from "@/shared/api/ApiResult"
import { UserInfoService } from "@/shared/api/services/UserInfoService"
import { useAppStore } from "@/shared/store/appStore"
import type { UserProfileInfoDto } from "@/shared/types/userTypes/UserInfoTypes"
import { useEffect, useMemo, useState } from "react"
import type { StatBoxSectionProps } from "../sections/StatBoxSection"

export const useProfileInfo = (profileId: number) => {
  const userId = useAppStore((s) => s.userId)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const [profileInfo, setProfileInfo] = useState<UserProfileInfoDto | null>(
    null
  )

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const isOwnProfile =
    isAuthenticated && !Number.isNaN(profileId) && userId === profileId

  useEffect(() => {
    if (Number.isNaN(profileId)) {
      setError("Nieprawidłowy identyfikator profilu.")
      setLoading(false)
      return
    }
    let cancelled = false

    const fetchProfileInfo = async () => {
      try {
        setLoading(true)
        setError(null)
        const res: ApiResult<UserProfileInfoDto> =
          await UserInfoService.getProfileInfo(profileId)
        if (!res.isSuccess || !res.data) {
          setError(res.message ?? "Nie udało się załadować profilu.")
          return
        }
        setProfileInfo(res.data)
      } catch (e) {
        if (!cancelled) {
          setError("Wystąpił błąd podczas ładowania profilu.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    void fetchProfileInfo()
    return () => {
      cancelled = true
    }
  }, [profileId])

  const stats: StatBoxSectionProps | null = useMemo(() => {
    if (!profileInfo) return null
    return {
      activeOffers: profileInfo.activeOffersCount,
      successfulTrades: profileInfo.successTradesCount,
      avgRating: profileInfo.rating,
      successRatePct: profileInfo.successRate,
    }
  }, [profileInfo])
  return { profileInfo, stats, loading, error, isOwnProfile }
}
