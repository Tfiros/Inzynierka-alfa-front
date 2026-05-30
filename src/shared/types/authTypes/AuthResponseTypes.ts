export type LoginResponseDto = {
  id: number
  idToken?: string | null
  userId?: string | null
  expiresIn?: number
}

export type RefreshResponseDto = {
  id: number
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
export type AuthMeResponseDto = {
  isAuthenticated: boolean
  userId: number | null
  login: string | null
  roles: string[]
}
