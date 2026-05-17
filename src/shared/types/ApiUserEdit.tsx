export type UserProfileInfoResponse = {
  id: number
  experience: number
  level: number
  registrationDate: string
  nickname: string
  description: string
  imageUrl?: string | null
}

export type UpdateProfileRequest = {
  nickname: string
  description: string
}
