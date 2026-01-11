import type {
  offerCoreDto,
  offerItemDto,
  offerListingItemDto,
  offerOrderBy,
  offerUserDto,
} from "./OfferTypes"

//Request Types
export type offerListingQueryRequest = {
  page: number
  pageSize: number
  gameId?: number
  genreId?: number
  searchText?: string
  orderBy: offerOrderBy
}
export type offerDraftRequest = {
  expDate: string
  offeredItems: offerItemDto[]
  wantedItems: offerItemDto[]
}

//Response Types
export type offerListingDtoResponse = {
  offerCoreDto: offerCoreDto
  offerUserDto: offerUserDto
  offeredItems: offerListingItemDto[]
  wantedItems: offerListingItemDto[]
  offeredItemsCount: number
  wantedItemsCount: number
}
export type offerDetailsDtoResponse = {
  offerCoreDto: offerCoreDto
  offerUserDto: offerUserDto
  offeredItems: offerListingItemDto[]
  wantedItems: offerListingItemDto[]
}
