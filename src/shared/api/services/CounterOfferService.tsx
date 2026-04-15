import type {
  CounterOfferDraftRequest,
  CounterOfferDto,
} from "@/shared/types/counterOfferTypes/RequestResponseTypes"
import { post } from "../ApiClient"
import type { CounterOfferCostResponse } from "@/shared/types/counterOfferTypes/CounterOfferCostResponse"

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
}
