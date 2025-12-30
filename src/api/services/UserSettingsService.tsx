import { get, put } from '../ApiClient'
import type {
  UpdateProfileSecurityRequest,
  UserSecurityProfileInfoResponse,
} from '../UserSecurityInfo'

export class UserSettingsService {
  private static readonly base = '/UserSettings'

  static getProfileInfo(id: number | null) {
    return get<UserSecurityProfileInfoResponse>(`${this.base}/get-data/${id}`)
  }

  static updateProfile(body: UpdateProfileSecurityRequest) {
    return put<string>(`${this.base}/update-data`, body)
  }
}
