import type { CounterOfferItemsDto } from "./CounterOfferItemsDto"

export type CounterOfferListItemDto = {
  counterOfferId: number
  offerId: number
  offerTitle: string
  offerOwnerUserId: number
  counterOfferUserId: number
  otherPartyNickname?: string | null
  creationDate: string
  tokensOffered: number
  statusId: number
  statusName: string
  items: CounterOfferItemsDto[]
}
