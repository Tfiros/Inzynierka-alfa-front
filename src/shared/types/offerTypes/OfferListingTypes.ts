export type OfferListingItemType = {
  itemId: number
  name: string
  photoUrl: string
  quantity: number
  gameName: string
  genreName: string
}

export type OfferListingType = {
  id: number
  expDate: string
  creationDate: string
  tokenCost: number
  offerStatusId: number
  offeredItems: OfferListingItemType[]
  wantedItems: OfferListingItemType[]
  user: OfferUserStateType
}

export type OfferUserStateType = {
  id: number
  nickname: string
  imageUrl: string | null
}

export type OfferItemDTO = {
  itemId: number
  quantity: number
}
