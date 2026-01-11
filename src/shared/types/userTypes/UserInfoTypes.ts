export type UserNavbarInfoDto = {
  id: number
  nickname: string
  email: string
  tokens: number
  experience: number
  level: number
}

export type UserProfileInfoDto = {
  id: number
  experience: number
  level: number
  registrationDate: string
  nickname: string
  description: string
  SuccessTradesCount: number
  Rating: number
  SuccessRate: number
}

export type UserProfileInfoUpdateDto = {
  nickname?: string
  description?: string
}
