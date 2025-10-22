export type LoginRequestDto = { email: string; password: string };
export type RegisterRequestDto = { email: string; password: string };
export type ForgotPasswordRequestDto = { email: string };
export type RefreshTokenRequestDto = { refreshToken: string };