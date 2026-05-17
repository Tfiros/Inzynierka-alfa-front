import type { UserProfileInfoDto } from "@/shared/types/userTypes/UserInfoTypes"
import ProfileHeader from "../component/ProfilHeader"

type HeaderSectionProps = {
  profile: UserProfileInfoDto
  canEdit: boolean
}

const HeaderSection = ({ profile, canEdit }: HeaderSectionProps) => {
  const joinedYear = new Date(profile.registrationDate).getFullYear()

  return (
    <section>
      <div className="max-w-6xl mx-auto">
        <ProfileHeader
          handle={`@${profile.nickname}`}
          name={profile.nickname}
          bio={profile.description ?? "Ten użytkownik nie dodał jeszcze opisu."}
          avatar={profile.imageUrl ?? undefined}
          joinedYear={joinedYear}
          editPath="/profileEdit"
          canEdit={canEdit}
        />
      </div>
    </section>
  )
}

export default HeaderSection
