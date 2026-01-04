import type {
  UpdateProfileRequest,
  UserProfileInfoResponse,
} from "@/shared/types/ApiUserEdit"
import { get, put } from "../ApiClient"

export type Profile = {
  username: string
  bio: string
  avatar?: string
  level: number
  coins: number
  memberSince: number
}

export class ProfileInfoService {
  private static readonly base = "/UserInfo"

  static getProfileInfo(id: number | null) {
    return get<UserProfileInfoResponse>(`${this.base}/profileInfo/${id}`)
  }

  static updateProfile(body: UpdateProfileRequest, id: number | null) {
    return put<UserProfileInfoResponse>(`${this.base}/profileInfo/${id}`, body)
  }
}

export function mapBackendToProfile(v: UserProfileInfoResponse): Profile {
  return {
    username: v.nickname,
    bio: v.description,
    level: v.level,
    coins: v.experience,
    memberSince: memberFor(v.registrationDate),
  }
}

export function mapProfileToUpdateRequest(p: Profile): UpdateProfileRequest {
  return {
    nickname: p.username,
    description: p.bio,
  }
}

export function memberFor(dateStr?: string) {
  const y = Number(String(dateStr).slice(0, 4))
  return Number.isFinite(y) ? y : new Date().getFullYear()
}
