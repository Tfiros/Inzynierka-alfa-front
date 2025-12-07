import { get, put } from "@/api/ApiClient";
import type { UserNavbarInfoDto, UserProfileInfoDto, UserProfileInfoUpdateDto } from "@/shared/types/userTypes/UserInfoTypes";

export class UserInfoService {
  private static readonly base = "/UserInfo";
  // GET /userInfo/{id:int}
  public static readonly getNavbarInfo = async (userId: number) =>
    get<UserNavbarInfoDto>(`${this.base}/navbarInfo/${userId}`);

  // GET /profileInfo/{id:int}
  public static readonly getProfileInfo = async (userId: number) =>
    get<UserProfileInfoDto>(`${this.base}/profileInfo/${userId}`);

  // PUT /profileInfo
  public static readonly updateProfileInfo = async () =>
    put<UserProfileInfoUpdateDto>(`${this.base}/profileInfo`);
}
