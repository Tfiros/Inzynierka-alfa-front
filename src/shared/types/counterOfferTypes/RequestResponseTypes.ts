export type CounterOfferItemRequest = {
  itemId: number
  quantity: number
}

export type CounterOfferDraftRequest = {
  tokensOffered: number
  items: CounterOfferItemRequest[]
}

export type CounterOfferItemDto = {
  itemId: number
  quantity: number
}

export type CounterOfferDto = {
  id: number
  offerId: number
  userId: number
  creationDate: string
  counterOfferStatusId: number
  tokensOffered: number
  items: CounterOfferItemDto[]
}
