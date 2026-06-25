import { useCallback, useEffect, useState } from "react"
import { UserSettingsService } from "@/shared/api/services/UserSettingsService"
import {
  mapSecurityBackendToFields,
  mapSecurityToUpdateRequest,
  type SecurityFields,
} from "../utils/ProfileSecurityData"
import { useAppStore } from "@/shared/store/appStore"
import { UserInfoService } from "@/shared/api/services/UserInfoService"
import { mapBackendToProfile, type Profile } from "../utils/ProfileMapper"

export const useProfileEdit = () => {
  const userId = useAppStore((s) => s.userId)
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [security, setSecurity] = useState<SecurityFields | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingSecurity, setSavingSecurity] = useState(false)
  const [savingAvatar, setSavingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)

  const fetchProfileData = useCallback(async () => {
    let alive = true
    if (userId === null) {
      setError("Brak zalogowanego użytkownika")
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)

      const [resProfile, resSecurity] = await Promise.all([
        UserInfoService.getProfileInfo(userId),
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
    if (!profile || userId === null) return
    try {
      setSavingProfile(true)
      setError(null)

      const body = {
        nickname: profile.username,
        description: profile.bio,
      }

      const res = await UserInfoService.updateProfileInfo(body, userId)
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
    if (!security || userId === null) return
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
      if (!profile || userId === null) return false
      try {
        setSavingAvatar(true)
        setAvatarError(null)
        const res = await UserInfoService.updateAvatar(file, userId)
        if (!res.isSuccess) {
          throw new Error(res.message ?? "Nie udało się zmienić avatara")
        }
        if (res.data) {
          setProfile(mapBackendToProfile(res.data))
        }
        await refreshNavbar()
        return true
      } catch (e) {
        setAvatarError(e instanceof Error ? e.message : "Błąd zapisu avatara")
        return false
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
    avatarError,
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
    setAvatarError,
  }
}

export default useProfileEdit
