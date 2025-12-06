export type UserNavbarInfoDto = {
  id: number;
  nickname: string;
  email: string;
  tokens: number;
  experience: number;
  level: number;
};

export type UserProfileInfoDto = {
  id: number;
  email: string;
  dateOfBirth: string;
  experience: number;
  level: number;
  registrationDate: string;
  nickname: string;
  description: string;
};

export type UserProfileInfoUpdateDto = {
  nickname?: string;
  description?: string;
};