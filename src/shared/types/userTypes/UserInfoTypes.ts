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
}

export type UserProfileInfoDto = {
  id: number
  experience: number
  level: number
  registrationDate: string
  nickname: string
  description: string
  activeOffersCount: number
  successTradesCount: number
  rating: number
  successRate: number
}

export type UserProfileInfoUpdateDto = {
  nickname?: string
  description?: string
}
