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
  title: string
  description: string
  durationDays: 7 | 14 | 31
  isHighlighted: boolean
  offeredItems: offerItemDto[]
  wantedItems: offerItemDto[]
}

export type offerUpdateDraftRequest = {
  title: string
  description: string
  durationDays: 0 | 7 | 14 | 31
  isHighlighted: boolean
  offeredItems: offerItemDto[]
  wantedItems: offerItemDto[]
}

export type offerUpdateQuoteResponse = {
  newTotalCost: number
  updateFee: number
}

//Response Types
export type offerListingDtoResponse = {
  offerCoreDto: offerCoreDto
  offerUserDto: offerUserDto
  offeredItems: offerListingItemDto[]
  wantedItems: offerListingItemDto[]
  offeredItemsTotalCount: number
  wantedItemsTotalCount: number
}
export type offerDetailsDtoResponse = {
  offerCoreDto: offerCoreDto
  offerUserDto: offerUserDto
  offeredItems: offerListingItemDto[]
  wantedItems: offerListingItemDto[]
}

export type offerQuoteResponse = {
  finalCost: number
}

export type ItemOfferDto = {
  id: number
  name: string
  photoUrl: string
  estimatedTokenValue: number
  game: GameOfferDTO
}

export type GameOfferDTO = {
  id: number
  name: string
  photoUrl: string | null
}

export type OfferListingItemDTO = {
  itemId: number
  name: string
  gameId: number
  photoUrl: string
  quantity: number
  gameName: string
  genreId: number
  genreName: string
}

export type OfferInformationDTO = {
  offerId: number
  ownerId: number
  title: string
  description: string | null
  tokenCost: number
  expDate: string
  offerStatusId: number
  creationDate: string
  items: OfferListingItemDTO[]
}
