import { Card } from "@/shared/components/card"
import { useState } from "react"
import { Tabs } from "@/shared/components/tabs"
import useProfileEdit from "./hooks/UseProfileEdit"
import ProfileCardSection from "./sections/ProfileCardSection"
import ProfileDataSection from "./sections/ProfileDataSection"
import ProfilePickerSection from "./sections/ProfilePickerSection"
import ProfileSecurityDataSection from "./sections/ProfileSecurityDataSection"
import AvatarChangeDialog from "./components/AvatarChangeDialog"

const ProfileEdit = () => {
  const {
    profile,
    security,
    loading,
    error,
    avatarError,
    savingProfile,
    savingSecurity,
    savingAvatar,
    onSaveProfile,
    onSaveSecurity,
    onChangeAvatar,
    setProfile,
    setSecurity,
    setAvatarError,
  } = useProfileEdit()
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false)

  if (loading) return <div className="p-6">Ładowanie…</div>
  if (!profile) return <div className="p-6">Brak danych profilu</div>

  return (
    <div className="min-h-[80vh] w-full px-6 py-10">
      <h1 className="text-3xl md:text-5xl font-semibold text-center mb-10">
        Edytuj Profil
      </h1>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[320px_1fr]">
        <ProfileCardSection
          profile={profile}
          onOpenAvatarDialog={() => setAvatarDialogOpen(true)}
        />

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
        <AvatarChangeDialog
          open={avatarDialogOpen}
          saving={savingAvatar}
          onOpenChange={(open) => {
            setAvatarDialogOpen(open)
            if (!open) {
              setAvatarError(null)
            }
          }}
          error={avatarError}
          onSubmit={async (file) => {
            const submited = await onChangeAvatar(file)
            if (submited) setAvatarDialogOpen(false)
          }}
        />
      </div>
    </div>
  )
}

export default ProfileEdit
