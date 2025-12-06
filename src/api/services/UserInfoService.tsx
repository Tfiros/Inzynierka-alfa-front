import { get, put } from "@/api/ApiClient";
import type { UserNavbarInfoDto, UserProfileInfoDto, UserProfileInfoUpdateDto } from "@/shared/types/userTypes/UserInfoTypes";

export class UserInfoService {
  // GET /userInfo/{id:int}
  public static readonly getNavbarInfo = async (userId: number) =>
    get<UserNavbarInfoDto>(`/userInfo/${userId}`);

  // GET /profileInfo/{id:int}
  public static readonly getProfileInfo = async (userId: number) =>
    get<UserProfileInfoDto>(`/profileInfo/${userId}`);

  // PUT /profileInfo
  public static readonly updateProfileInfo = async () =>
    put<UserProfileInfoUpdateDto>(`/profileInfo`);
}
