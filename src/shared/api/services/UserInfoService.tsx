import type {
  UserNavbarInfoDto,
  UserProfileInfoDto,
  UserProfileInfoUpdateDto,
} from "@/shared/types/userTypes/UserInfoTypes"
import { get, put } from "../ApiClient"
import type { PagedResponse } from "@/shared/types/PagedType"
import type { offerListingDtoResponse } from "@/shared/types/offerTypes/RequestResponseTypes"
import type { CounterOfferType } from "@/shared/types/counterOfferTypes/CounterOfferType"
import type { CounterOfferListingsQueryType } from "@/shared/types/counterOfferTypes/CounterOfferListingQueryType"
import type { CounterOfferListItemDto } from "@/shared/types/counterOfferTypes/CounterOfferListItemDto"

export class UserInfoService {
  private static readonly base = "/UserInfo"
  // GET /userInfo/{id:int}
  public static readonly getNavbarInfo = async (userId: number) =>
    get<UserNavbarInfoDto>(`${this.base}/navbarInfo/${userId}`)

  // GET /profileInfo/{id:int}
  public static readonly getProfileInfo = async (userId: number) =>
    get<UserProfileInfoDto>(`${this.base}/profileInfo/${userId}`)

  // GET /profileInfo/{id:int}/offers/active
  public static readonly getPagedUserActiveOffers = async (args: {
    userId: number
    page: number
    pageSize: number
  }) =>
    get<PagedResponse<offerListingDtoResponse>>(
      `${this.base}/profileInfo/${args.userId}/offers/active`
    )
  // GET /profileInfo/{id:int}/offers/history
  public static readonly getPagedUserHistoryOffers = async (args: {
    userId: number
    page: number
    pageSize: number
  }) =>
    get<PagedResponse<offerListingDtoResponse>>(
      `${this.base}/profileInfo/${args.userId}/offers/history`
    )

  // PUT /profileInfo
  public static readonly updateProfileInfo = async (userId: number) =>
    put<UserProfileInfoUpdateDto>(`${this.base}/profileInfo/${userId}`)

  public static readonly getByType = async (
    type: CounterOfferType,
    query: CounterOfferListingsQueryType
  ) => {
    return get<PagedResponse<CounterOfferListItemDto>>(
      `${this.base}/counteroffers/${type}`,
      query
    )
  }
}
