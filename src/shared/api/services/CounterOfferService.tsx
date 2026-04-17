import type {
  CounterOfferDraftRequest,
  CounterOfferDto,
} from "@/shared/types/counterOfferTypes/RequestResponseTypes"
import { get, post, patch } from "../ApiClient"
import type { CounterOfferCostResponse } from "@/shared/types/counterOfferTypes/CounterOfferCostResponse"
import type { AcceptedOfferResponseType } from "@/shared/types/counterOfferTypes/AcceptedOfferResponseType"
import type { CounterOfferListItemDto } from "@/shared/types/counterOfferTypes/CounterOfferListItemDto"

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

  public static readonly getByType = async (type: CounterOfferType) =>
    get<CounterOfferListItemDto[]>(`${this.base}/${type}`)

  public static readonly updateStatus = async (
    counterOfferId: number,
    statusId: number
  ) =>
    patch<null>(`${this.base}/${counterOfferId}`, {
      statusId,
    })
}
