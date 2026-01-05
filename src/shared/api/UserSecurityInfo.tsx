export type UserSecurityProfileInfoResponse = {
  id: number
  email: string
  dateOfBirth: string
}

export type UpdateProfileSecurityRequest = {
  email: string
  dateOfBirth: string
}
