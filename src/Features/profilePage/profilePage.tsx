import { useParams } from "react-router-dom"
import HeaderSection from "./sections/HeaderSection"
import StatBoxSection from "./sections/StatBoxSection"
import TabSection from "./sections/TabSection"
import { useProfileInfo } from "./hooks/UseProfileInfo"
import OffersTabsSection from "../marketplacePage/sections/OffersTabsSection"
import type { OffersType } from "@/shared/types/offerTypes/OfferTypes"
import { useState } from "react"

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const profileId = id ? Number(id) : NaN

  const { profileInfo, stats, loading, error, isOwnProfile } =
    useProfileInfo(profileId)

  const [tab, setTab] = useState<OffersType>("offers")

  if (loading) return <div className="p-4">Ładowanie profilu...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!profileInfo || !stats)
    return <div className="p-4">Profil nie został znaleziony.</div>

  return (
    <div>
      <HeaderSection profile={profileInfo} canEdit={isOwnProfile} />
      <StatBoxSection stats={stats} />
      <TabSection profileId={profileId} />
    </div>
  )
}

export default ProfilePage
