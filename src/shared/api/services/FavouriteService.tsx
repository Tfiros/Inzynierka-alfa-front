import type { PagedResponse } from "@/shared/types/PagedType"
import { del, get, post } from "../ApiClient"
import type { offerListingDtoResponse } from "@/shared/types/offerTypes/RequestResponseTypes"

export class FavouriteService {
  private static readonly base = "/Favourites"

  public static readonly getFavourites = async (args: {
    page: number
    pageSize: number
  }) => get<PagedResponse<offerListingDtoResponse>>(this.base, args)

  public static readonly getFavouriteIds = async () =>
    get<number[]>(`${this.base}/ids`)

  public static readonly addFavourite = async (offerId: number) =>
    post<boolean>(`${this.base}/${offerId}`)

  public static readonly removeFavourite = async (offerId: number) =>
    del<boolean>(`${this.base}/${offerId}`)
}
