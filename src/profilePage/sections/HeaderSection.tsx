import React, { useMemo } from 'react'
import { ProfileHeader } from '../component/ProfilHeader'

const MOCK_USER = {
  handle: 'GoodUncle',
  name: 'Alek Radoliński',
  bio: 'Doświadczony gracz z 8-letnim doświadczeniem w tradingu. Specjalizuję się w skinach CS2 i rzadkich itemach z MMO.',
  avatar: '',
  verified: true,
  joinedYear: 2021,
}

export const HeaderSection: React.FC = () => {
  const profile = useMemo(() => MOCK_USER, [])

  return (
    <section>
      <div className="max-w-6xl mx-auto">
        <ProfileHeader
          handle={profile.handle}
          name={profile.name}
          bio={profile.bio}
          avatar={profile.avatar}
          joinedYear={profile.joinedYear}
          editPath="/profileEdit"
        />
      </div>
    </section>
  )
}
