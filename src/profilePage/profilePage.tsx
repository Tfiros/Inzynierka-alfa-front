import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { HeaderSection } from './sections/HeaderSection'
import { UserInfoService } from '@/api/services/UserInfoService'
import type { ApiResult } from '@/api/ApiResult'
import type { UserProfileInfoDto } from '@/shared/types/userTypes/UserInfoTypes'
import { useAppStore } from '@/store/appStore'
import { StatBoxSection } from './sections/StatBoxSection'
import { TabSection } from './sections/TabSection'

export const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const profileId = id ? Number(id) : NaN
  const navigate = useNavigate()

  const userId = useAppStore((state) => state.userId)
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  const [profileInfo, setProfileInfo] = useState<UserProfileInfoDto | null>(
    null
  )
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const isOwnProfile =
    isAuthenticated && !Number.isNaN(profileId) && userId === profileId

  useEffect(() => {
    if (!id || Number.isNaN(profileId)) {
      setError('Nieprawidłowy identyfikator profilu.')
      setLoading(false)
      return
    }
    console.log('id: ' + id)
    console.log('Profile ID: ' + profileId)
    console.log('UserId: ' + userId)

    const fetchProfileInfo = async () => {
      try {
        setLoading(true)
        setError(null)

        const res: ApiResult<UserProfileInfoDto> =
          await UserInfoService.getProfileInfo(profileId)

        if (!res.isSuccess || !res.data) {
          setError(res.message ?? 'Nie udało się załadować profilu.')
          return
        }

        setProfileInfo(res.data)
      } catch (e) {
        setError('Wystąpił błąd podczas ładowania profilu.')
      } finally {
        setLoading(false)
      }
    }
    void fetchProfileInfo()
  }, [id, profileId])

  if (loading) return <div className="p-4">Ładowanie profilu...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!profileInfo)
    return <div className="p-4">Profil nie został znaleziony.</div>

  return (
    <div>
      <HeaderSection profile={profileInfo} canEdit={isOwnProfile} />
      <StatBoxSection />
      <TabSection />
    </div>
  )
}
