export type UserNavbarInfoDto = {
  id: number
  nickname: string
  email: string
  tokens: number
  escrowedTokens: number
  experience: number
  level: number
  chatIds: number[]
  chatUnreadTotal: number
  notificationsUnreadTotal: number
  imageUrl?: string | null
}

export type UserProfileInfoDto = {
  id: number
  experience: number
  level: number
  registrationDate: string
  nickname: string
  description: string
  imageUrl?: string | null
  activeOffersCount: number
  successTradesCount: number
  rating: number
  successRate: number
}

export type UserProfileInfoUpdateDto = {
  nickname?: string
  description?: string
}
