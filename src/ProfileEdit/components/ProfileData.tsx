import type {
  UpdateProfileRequest,
  UserProfileInfoResponse,
} from '@/api/ApiUserEdit'

export type Profile = {
  username: string
  bio: string
  avatar?: string
  level: number
  coins: number
  memberSince: number
}

export function memberFor(dateStr?: string) {
  if (!dateStr) return new Date().getFullYear()
  const y = Number(String(dateStr).slice(0, 4))
  return Number.isFinite(y) ? y : new Date().getFullYear()
}

export function mapBackendToProfile(v: UserProfileInfoResponse): Profile {
  return {
    username: v.nickname,
    bio: v.description,
    level: v.level,
    coins: v.experience,
    memberSince: memberFor(v.registrationDate as any),
  }
}

export function mapProfileToUpdateRequest(p: Profile): UpdateProfileRequest {
  return {
    nickname: p.username,
    description: p.bio,
  }
}
