export type UserProfileInfoResponse = {
  id: number
  experience: number
  level: number
  registrationDate: string
  nickname: string
  description: string
}

export type UpdateProfileRequest = {
  nickname: string
  description: string
}
