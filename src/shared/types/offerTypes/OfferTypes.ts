export type offerCoreDto = {
  offerId: number
  title: string
  description: string
  expDate: string
  creationDate: string
  tokenCost: number
  offerStatusId: number
  isHighlighted: boolean
}

export type offerUserDto = {
  userId: number
  nickname: string
  imageUrl: string | null
  successTradesCount: number
  rating: number
  successRate: number
}

export type offerListingItemDto = {
  itemId: number
  name: string
  gameId: number
  photoUrl: string
  quantity: number
  gameName: string
  genreId: number
  genreName: string
  rarityId: number
  rarityName: string
}

export type offerItemDto = {
  itemId: number
  quantity: number
}

export const offerOrderBy = {
  newest: 1,
  oldest: 2,
  tokenCostAsc: 3,
  tokenCostDesc: 4,
  expDateAsc: 5,
  expDateDesc: 6,
} as const
export type offerOrderBy = (typeof offerOrderBy)[keyof typeof offerOrderBy]
