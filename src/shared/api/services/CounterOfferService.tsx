import type {
  CounterOfferDraftRequest,
  CounterOfferDto,
} from "@/shared/types/counterOfferTypes/RequestResponseTypes"
import { get, post, patch } from "../ApiClient"
import type { CounterOfferCostResponse } from "@/shared/types/counterOfferTypes/CounterOfferCostResponse"
import type { AcceptedOfferResponseType } from "@/shared/types/counterOfferTypes/AcceptedOfferResponseType"
import type { CounterOfferListItemDto } from "@/shared/types/counterOfferTypes/CounterOfferListItemDto"
import type { CounterOfferListingsQueryType } from "@/shared/types/counterOfferTypes/CounterOfferListingQueryType"
import type { PagedResponse } from "@/shared/types/PagedType"

export type CounterOfferType = "sent" | "received"

export class CounterOfferService {
  private static readonly base = "/CounterOffers"

  public static readonly quote = async (
    offerId: number,
    body: CounterOfferDraftRequest
  ) => post<CounterOfferCostResponse>(`${this.base}/${offerId}/quote`, body)

  public static readonly create = async (
    offerId: number,
    body: CounterOfferDraftRequest
  ) => post<CounterOfferDto>(`${this.base}/${offerId}/counter`, body)

  public static readonly accept = async (counterOfferId: number) =>
    post<AcceptedOfferResponseType>(`${this.base}/${counterOfferId}/accept`)

  public static readonly getByType = async (
    type: CounterOfferType,
    query: CounterOfferListingsQueryType
  ) => {
    const params = new URLSearchParams({
      page: String(query.page),
      pageSize: String(query.pageSize),
      orderBy: String(query.orderBy),
    })

    return get<PagedResponse<CounterOfferListItemDto>>(
      `${this.base}/${type}?${params.toString()}`
    )
  }

  public static readonly updateStatus = async (
    counterOfferId: number,
    statusId: number
  ) =>
    patch<null>(`${this.base}/${counterOfferId}`, {
      statusId,
    })
}
