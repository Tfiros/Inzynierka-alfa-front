import type { Profile } from "@/api/services/ProfileInfoService"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/Avatar"
import { Card } from "@/shared/components/Card"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Button } from "react-day-picker"

type Props = {
  profile: Profile
}

export const initials = (name?: string) =>
  (
    name
      ?.split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("") || "?"
  ).toUpperCase()

export const ProfileCardSection = ({ profile }: Props) => {
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
          <Button>Zmień avatar</Button>
        </div>

        <Separator className="my-2 w-full" />

        <div className="w-full text-sm text-muted-foreground grid grid-cols-2 gap-y-2">
          <span>Poziom</span>
          <span className="text-right text-foreground">{profile.level}</span>

          <span>Monety</span>
          <span className="text-right text-foreground">{profile.coins}</span>

          <span>Członek od</span>
          <span className="text-right text-foreground">
            {profile.memberSince}
          </span>
        </div>
      </div>
    </Card>
  )
}
