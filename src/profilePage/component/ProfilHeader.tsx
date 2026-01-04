import React from "react"
import { CalendarDays, Edit } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/componentsShared/button"
import { Link } from "react-router-dom"

const initials = (name?: string) =>
  (
    name
      ?.split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("") || "?"
  ).toUpperCase()

type ProfileHeaderProps = {
  handle: string
  name: string
  bio: string
  avatar?: string
  joinedYear: number
  canEdit: boolean
  editPath?: string
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  handle,
  name,
  bio,
  avatar,
  joinedYear,
  editPath = "/profileEdit",
  canEdit = false,
}: ProfileHeaderProps) => {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-16 w-16 md:h-20 md:w-20">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{initials(name)}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="text-sm text-muted-foreground">{handle}</div>
        <h1 className="text-lg md:text-xl font-semibold mt-1">{name}</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-3xl leading-relaxed">
          {bio}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <CalendarDays className="h-4 w-4" /> Dołączył w {joinedYear}
          </span>
        </div>
      </div>

      {canEdit && (
        <div className="shrink-0">
          <Button variant="outline" className="h-9" asChild>
            <Link to={editPath}>
              <Edit className="h-4 w-4 mr-2" />
              Edytuj profil
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
