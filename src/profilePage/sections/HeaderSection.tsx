import React, { useMemo } from 'react'
import { CalendarDays, Edit } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const MOCK_USER = {
  handle: 'GoodUncle',
  name: 'Alek Radoliński',
  bio: 'Doświadczony gracz z 8-letnim doświadczeniem w tradingu. Specjalizuję się w skinach CS2 i rzadkich itemach z MMO.',
  avatar: '',
  verified: true,
  joinedYear: 2021,
}
const initials = (name?: string) =>
  (
    name
      ?.split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join('') || '?'
  ).toUpperCase()

export const HeaderSection = () => {
  const profile = useMemo(() => MOCK_USER, [])

  return (
    <section>
      <div>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 md:h-20 md:w-20">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{initials(profile.name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="text-sm text-muted-foreground">
                {profile.handle}
              </div>
              <h1 className="text-lg md:text-xl font-semibold mt-1">
                {profile.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground max-w-3xl leading-relaxed">
                {profile.bio}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" /> Dołączył w{' '}
                  {profile.joinedYear}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <Button variant="outline" className="h-9">
                <Edit className="h-4 w-4 mr-2" /> Edytuj profil
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
