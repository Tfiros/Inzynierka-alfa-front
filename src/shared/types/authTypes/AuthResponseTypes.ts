export type LoginResponseDto = {
  id: number
  accessToken: string
  idToken?: string | null
  userId?: string | null
  expiresIn?: number
}

export type RefreshResponseDto = {
  accessToken: string
  idToken?: string | null
  userId?: string | null
  expiresIn?: number
}

export type RegisterResponseDto = {
  message?: string
  userId?: string | null
}

export type ForgotPasswordResponseDto = {
  message?: string
}

export type LogoutResponseDto = {
  message?: string
}
