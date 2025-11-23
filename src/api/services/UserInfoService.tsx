import { get } from "@/api/ApiClient";
import type { UserNavbarInfoDto, UserProfileInfoDto } from "@/shared/types/userTypes/UserInfoTypes";

export class UserInfoService {
  // GET /userInfo/{id:int}
  public static readonly getNavbarInfo = async (userId: number) =>
    get<UserNavbarInfoDto>(`/userInfo/${userId}`);

  // GET /profileInfo/{id:int}
  public static readonly getProfileInfo = async (userId: number) =>
    get<UserProfileInfoDto>(`/profileInfo/${userId}`);
}
