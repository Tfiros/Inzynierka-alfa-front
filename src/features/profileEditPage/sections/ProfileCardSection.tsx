import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { Button } from "@/shared/components/button"
import { Card } from "@/shared/components/card"
import { Separator } from "@/shared/components/separator"
import type { Profile } from "../utils/ProfileMapper"

type Props = {
  profile: Profile
  onOpenAvatarDialog: () => void
}

export const initials = (name?: string) =>
  (
    name
      ?.split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("") || "?"
  ).toUpperCase()

const ProfileCardSection = ({ profile, onOpenAvatarDialog }: Props) => {
  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-28 w-28">
          <AvatarImage src={profile.avatar || ""} alt={profile.username} />
          <AvatarFallback className="text-lg">
            {initials(profile.username)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-center gap-2">
          <Button
            type="button"
            onClick={onOpenAvatarDialog}
            className="cursor-pointer"
          >
            Zmień avatar
          </Button>
        </div>

        <Separator className="my-2 w-full" />

        <div className="w-full text-sm text-muted-foreground grid grid-cols-2 gap-y-2">
          <span>Poziom</span>
          <span className="text-right text-foreground">{profile.level}</span>

          <span>Członek od</span>
          <span className="text-right text-foreground">
            {profile.memberSince}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default ProfileCardSection
