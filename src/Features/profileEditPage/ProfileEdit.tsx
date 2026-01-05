import { Card } from "@/shared/components/Card"
import { ProfileDataSection } from "./sections/ProfileDataSection"
import { ProfileSecurityDataSection } from "./sections/ProfileSecurityDataSection"
import { ProfilePickerSection } from "./sections/ProfilePickerSection"
import {
  mapSecurityBackendToFields,
  mapSecurityToUpdateRequest,
  type SecurityFields,
} from "./components/ProfileSecurityData"
import { useEffect, useState } from "react"
import { ProfileCardSection } from "./sections/ProfileCardSection"
import { Tabs } from "@/shared/components/Tabs"
import { useAppStore } from "@/shared/store/AppStore"
import {
  ProfileInfoService,
  mapBackendToProfile,
  type Profile,
} from "@/shared/api/services/ProfileInfoService"
import { UserSettingsService } from "@/shared/api/services/UserSettingsService"

export const ProfileEdit = () => {
  const userId = useAppStore((s) => s.userId)
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [security, setSecurity] = useState<SecurityFields | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingSecurity, setSavingSecurity] = useState(false)

  useEffect(() => {
    let alive = true

    async function fetchProfileData() {
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
    }

    fetchProfileData()

    return () => {
      alive = false
    }
  }, [userId])

  const onSaveProfile = async () => {
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
  }

  const onSaveSecurity = async () => {
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
  }

  if (loading) return <div className="p-6">Ładowanie…</div>
  if (!profile) return <div className="p-6">Brak danych profilu</div>

  return (
    <div className="min-h-[80vh] w-full px-6 py-10">
      <h1 className="text-3xl md:text-5xl font-semibold text-center mb-10">
        Edytuj Profil
      </h1>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[320px_1fr]">
        <ProfileCardSection profile={profile}></ProfileCardSection>

        <Card className="p-4 md:p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Tabs defaultValue="profile" className="w-full">
            <ProfilePickerSection />

            <ProfileDataSection
              profile={profile}
              setProfile={setProfile}
              savingProfile={savingProfile}
              onSaveProfile={onSaveProfile}
            />

            <ProfileSecurityDataSection
              security={security}
              setSecurity={setSecurity}
              savingSecurity={savingSecurity}
              onSaveSecurity={onSaveSecurity}
            />
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
