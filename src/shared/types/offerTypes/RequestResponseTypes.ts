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
  rarityId?: number
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
  tokensOffered: number
  tokensWanted: number
}

export type offerUpdateDraftRequest = {
  title: string
  description: string
  durationDays: 0 | 7 | 14 | 31
  isHighlighted: boolean
  offeredItems: offerItemDto[]
  wantedItems: offerItemDto[]
  tokensOffered: number
  tokensWanted: number
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
  genreId: number
}

export type GenreOfferDTO = {
  id: number
  name: string
}

export type RarityOfferDTO = {
  id: number
  name: string
}

export type OfferListingItemDTO = {
  itemId: number
  name: string
  gameId: number
  photoUrl: string | null
  quantity: number
  gameName: string
  genreId: number
  genreName: string
}

export type OfferInformationDTO = {
  offerCoreDto: offerCoreDto
  offeredItems: OfferListingItemDTO[]
}
