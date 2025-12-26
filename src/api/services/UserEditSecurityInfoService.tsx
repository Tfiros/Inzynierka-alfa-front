import { get, put } from '../ApiClient'
import type {
  UpdateProfileSecurityRequest,
  UserSecurityProfileInfoResponse,
} from '../UserSecurityInfo'

export const userSecurityInfoApi = {
  getProfileInfo: (id: number | null) =>
    get<UserSecurityProfileInfoResponse>(`/UserSettings/profileInfo/${id}`),

  // ✅ backend nie ma id w URL
  updateProfile: (body: UpdateProfileSecurityRequest) =>
    put<string>(`/UserSettings/update-data`, body),
}
