import type { OfferItemDTO, OfferListingItemType } from "./OfferListingTypes"

export type OfferDraftRequest = {
  expDate: string
  offeredItems: OfferItemDTO[]
  wantedItems: OfferItemDTO[]
}

export type OfferRespone = {
  id: number
  expDate: string
  creationDate: string
  tokenCost: number
  offerStatusId: number
  offeredItems: OfferListingItemType[]
  wantedItems: OfferListingItemType[]
}
