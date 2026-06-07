import { OfferStatus } from "../enums/OfferStatus"
import { useAppStore } from "../store/appStore"

export const useOfferPermissions = (
  offerStatusId: number,
  ownerUserId: number
) => {
  const currentUserId = useAppStore((s) => s.userId)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  const isOwner = isAuthenticated && currentUserId === ownerUserId
  const isActive = offerStatusId === OfferStatus.Active

  return { isOwner, isActive, isAuthenticated }
}
