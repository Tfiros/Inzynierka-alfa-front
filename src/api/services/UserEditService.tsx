import { get, put } from '@/api/ApiClient'

import type {
  UserProfileInfoResponse,
  UpdateProfileRequest,
} from '../ApiUserEdit'

export const userInfoApi = {
  getProfileInfo: (id: number | null) =>
    get<UserProfileInfoResponse>(`/UserInfo/profileInfo/${id}`),

  updateProfile: (body: UpdateProfileRequest, id: number | null) =>
    put<UserProfileInfoResponse>(`/UserInfo/profile/${id}`, body),
}
