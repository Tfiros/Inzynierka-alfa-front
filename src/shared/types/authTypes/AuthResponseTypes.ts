export type LoginResponseDto = {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  userId?: string | null;
};

export type RefreshResponseDto = {
  AccessToken?: string;
  IdToken?: string;
  RefreshToken?: string;
  UserId?: string | null;
};

export type RegisterResponseDto = {
  Message?: string;
  UserId?: string;
};

export type ForgotPasswordResponseDto = {
  Message?: string;
};

export type LogoutResponseDto = {
  Message?: string;
};
