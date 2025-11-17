export type LoginRequestDto = { email: string; password: string };
export type RegisterRequestDto = { email: string; password: string, username: string, birthDate: Date};
export type ForgotPasswordRequestDto = { email: string };