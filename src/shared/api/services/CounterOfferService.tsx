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

  public static readonly updateStatus = async (
    counterOfferId: number,
    statusId: number
  ) =>
    patch<null>(`${this.base}/${counterOfferId}`, {
      statusId,
    })

  public static readonly cancel = async (counterOfferId: number) =>
    post<CounterOfferDto>(`${this.base}/${counterOfferId}/cancel`)

  public static readonly getForOffer = async (offerId: number) =>
    get<CounterOfferListItemDto[]>(`${this.base}/offer/${offerId}`)

  public static readonly hasPendingOffer = async (offerId: number) =>
    get<boolean>(`${this.base}/offer/${offerId}/has-pending`)
}
