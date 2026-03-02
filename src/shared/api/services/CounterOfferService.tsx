import type {
  CounterOfferDraftRequest,
  CounterOfferDto,
} from "@/shared/types/counterOfferTypes/RequestResponseTypes"
import { get, post } from "../ApiClient"
import type { OfferInformationDTO } from "@/shared/types/offerTypes/RequestResponseTypes"

export class CounterOfferService {
  private static readonly base = "/CounterOffers"

  public static readonly getOfferInfo = async (offerId: number) =>
    get<OfferInformationDTO>(`${this.base}/${offerId}/info`)

  public static readonly create = async (
    offerId: number,
    body: CounterOfferDraftRequest
  ) => post<CounterOfferDto>(`${this.base}/${offerId}/counter`, body)
}
