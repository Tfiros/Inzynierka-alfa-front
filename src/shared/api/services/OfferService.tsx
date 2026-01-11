import type { PagedResponse } from "@/shared/types/PagedType"
import { del, get, post, put } from "../ApiClient"
import type {
  offerDetailsDtoResponse,
  offerDraftRequest,
  offerListingDtoResponse,
  offerListingQueryRequest,
} from "@/shared/types/offerTypes/RequestResponseTypes"

export class OfferService {
  private static readonly base = "/Offers"
  // GET /Offers?page=&pageSize=&genreId=&searchText=
  public static readonly getPaged = async (req: offerListingQueryRequest) =>
    get<PagedResponse<offerListingDtoResponse>>(this.base, req)

  // GET /Offers/{id}
  public static readonly getDetails = async (id: number) =>
    get<offerDetailsDtoResponse>(`${this.base}/${id}`)
  // POST /Offers
  public static readonly create = async (req: offerDraftRequest) =>
    post<offerDetailsDtoResponse>(this.base, req)
  // PUT /Offers/{id}
  public static readonly update = async (id: number, req: offerDraftRequest) =>
    put<offerDetailsDtoResponse>(`${this.base}/${id}`, req)
  // DELETE /Offers/{id}
  public static readonly cancel = async (id: number) =>
    del<string>(`${this.base}/${id}`)
}
