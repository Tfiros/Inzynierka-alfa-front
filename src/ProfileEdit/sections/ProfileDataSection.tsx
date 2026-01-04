import { Input } from "@/components/ui/input"
import { Button } from "@/componentsShared/button"
import type { Dispatch } from "react"
import type { Profile } from "@/api/services/ProfileInfoService"
import { TabsContent } from "@/components/ui/tabs"
import { Label } from "@radix-ui/react-label"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  profile: Profile
  setProfile: Dispatch<React.SetStateAction<Profile | null>>
  savingProfile: boolean
  onSaveProfile: () => void
}

export const ProfileDataSection = ({
  profile,
  setProfile,
  savingProfile,
  onSaveProfile,
}: Props) => {
  return (
    <TabsContent value="profile" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label className="mb-2">Nazwa użytkownika</Label>
          <Input
            value={profile.username}
            onChange={(e) =>
              setProfile((p) => (p ? { ...p, username: e.target.value } : p))
            }
          />
        </div>

        <div className="md:col-span-2">
          <Label className="mb-2">Biografia</Label>
          <Textarea
            placeholder="Opowiedz coś o sobie..."
            value={profile.bio}
            onChange={(e) =>
              setProfile((p) => (p ? { ...p, bio: e.target.value } : p))
            }
          />
        </div>
      </div>

      <div className="pt-2 flex justify-center">
        <Button
          onClick={onSaveProfile}
          disabled={savingProfile}
          className="min-w-28"
        >
          {savingProfile ? "Zapisywanie..." : "Zapisz zmiany"}
        </Button>
      </div>
    </TabsContent>
  )
}
