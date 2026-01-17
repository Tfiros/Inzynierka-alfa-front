import type { PagedResponse } from "@/shared/types/PagedType"
import { del, get, post, put } from "../ApiClient"
import type {
  ItemOfferDto,
  offerDetailsDtoResponse,
  offerDraftRequest,
  offerListingDtoResponse,
  offerListingQueryRequest,
  offerQuoteResponse,
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
  public static readonly offerQuote = async (req: offerDraftRequest) =>
    post<offerQuoteResponse>(`${this.base}/quote`, req)

  public static readonly getSuggestedItemByQuery = async (query: string) =>
    get<ItemOfferDto[]>(`${this.base}/items/suggestions`, { query })

  public static readonly getSuggestedItemByQueryAndGame = async (
    query: string,
    gameId: number
  ) => get<ItemOfferDto[]>(`${this.base}/items`, { query, gameId })
}
