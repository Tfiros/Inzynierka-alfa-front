import type { UserProfileInfoDto } from "@/shared/types/userTypes/UserInfoTypes"

export function memberFor(dateStr?: string) {
  const y = Number(String(dateStr).slice(0, 4))
  return Number.isFinite(y) ? y : new Date().getFullYear()
}

export function mapBackendToProfile(v: UserProfileInfoDto): Profile {
  return {
    username: v.nickname,
    bio: v.description,
    avatar: v.imageUrl ?? undefined,
    level: v.level,
    memberSince: memberFor(v.registrationDate),
  }
}

export type Profile = {
  username: string
  bio: string
  avatar?: string
  level: number
  memberSince: number
}
