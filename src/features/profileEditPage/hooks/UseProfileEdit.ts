import { useCallback, useEffect, useState } from "react"
import {
  ProfileInfoService,
  mapBackendToProfile,
  type Profile,
} from "@/shared/api/services/ProfileInfoService"
import { UserSettingsService } from "@/shared/api/services/UserSettingsService"
import {
  mapSecurityBackendToFields,
  mapSecurityToUpdateRequest,
} from "../components/ProfileSecurityData"
import { useAppStore } from "@/shared/store/appStore"

export const useProfileEdit = () => {
  const userId = useAppStore((s) => s.userId)
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [security, setSecurity] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingSecurity, setSavingSecurity] = useState(false)
  const [savingAvatar, setSavingAvatar] = useState(false)

  const fetchProfileData = useCallback(async () => {
    let alive = true
    try {
      setLoading(true)
      setError(null)

      const [resProfile, resSecurity] = await Promise.all([
        ProfileInfoService.getProfileInfo(userId),
        UserSettingsService.getProfileInfo(userId),
      ])

      if (!resProfile.isSuccess || !resProfile.data) {
        throw new Error(resProfile.message ?? "Nie udało się pobrać profilu")
      }

      if (!resSecurity.isSuccess || !resSecurity.data) {
        throw new Error(
          resSecurity.message ?? "Nie udało się pobrać danych bezpieczeństwa"
        )
      }

      if (!alive) return

      setProfile(mapBackendToProfile(resProfile.data))
      setSecurity(mapSecurityBackendToFields(resSecurity.data))
    } catch (e) {
      if (!alive) return
      setProfile(null)
      setSecurity(null)
      setError(e instanceof Error ? e.message : "Błąd pobierania danych")
    } finally {
      if (alive) setLoading(false)
    }
    return () => {
      alive = false
    }
  }, [userId])

  useEffect(() => {
    void fetchProfileData()
  }, [fetchProfileData])

  const onSaveProfile = useCallback(async () => {
    if (!profile) return
    try {
      setSavingProfile(true)
      setError(null)

      const body = {
        nickname: profile.username,
        description: profile.bio,
      }

      const res = await ProfileInfoService.updateProfile(body, userId)
      if (!res.isSuccess) {
        throw new Error(res.message ?? "Nie udało się zapisać profilu")
      }

      if (res.data) setProfile(mapBackendToProfile(res.data))

      await refreshNavbar()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Błąd zapisu profilu")
    } finally {
      setSavingProfile(false)
    }
  }, [profile, refreshNavbar, userId])

  const onSaveSecurity = useCallback(async () => {
    if (!security) return
    try {
      setSavingSecurity(true)
      setError(null)
      const body = mapSecurityToUpdateRequest(security)

      const res = await UserSettingsService.updateProfile(body)
      if (!res.isSuccess) {
        throw new Error(res.message ?? "Nie udało się zapisać ustawień")
      }

      const fresh = await UserSettingsService.getProfileInfo(userId)
      if (fresh.isSuccess && fresh.data) {
        setSecurity(mapSecurityBackendToFields(fresh.data))
      }

      await refreshNavbar()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Błąd zapisu ustawień")
    } finally {
      setSavingSecurity(false)
    }
  }, [security, userId, refreshNavbar])

  const onChangeAvatar = useCallback(
    async (file: File) => {
      if (!profile) return
      try {
        setSavingAvatar(true)
        setError(null)
        const res = await ProfileInfoService.updateAvatar(file, userId)
        if (!res.isSuccess) {
          throw new Error(res.message ?? "Nie udało się zmienić avatara")
        }
        if (res.data) {
          setProfile(mapBackendToProfile(res.data))
        }
        await refreshNavbar()
      } catch (e) {
        setError(e instanceof Error ? e.message : "Błąd zapisu avatara")
      } finally {
        setSavingAvatar(false)
      }
    },
    [profile, refreshNavbar, userId]
  )

  return {
    profile,
    security,
    loading,
    error,
    savingProfile,
    savingSecurity,
    savingAvatar,
    fetchProfileData,
    onSaveProfile,
    onSaveSecurity,
    onChangeAvatar,
    setProfile,
    setSecurity,
    setError,
  }
}

export default useProfileEdit
