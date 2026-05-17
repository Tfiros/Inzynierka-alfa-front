export type MiddlemanTab = "available" | "mine" | "completed" | "failedReturns"

export type AssignMiddlemanRequest = {
  tradeId: number
}

export type UpdateTradeByMiddlemanRequest = {
  hasBuyerItems?: boolean | null
  hasSellerItems?: boolean | null
  buyerPhotos?: string[] | null
  sellerPhotos?: string[] | null
}

export const TradeSortBy = {
  CreationDateAsc: 1,
  CreationDateDesc: 2,
  TokenCostAsc: 3,
  TokenCostDesc: 4,
  TradeIdAsc: 5,
  TradeIdDesc: 6,
} as const

export type TradeSortBy = (typeof TradeSortBy)[keyof typeof TradeSortBy]

export const TradeSearchBy = {
  TradeId: 1,
  OfferId: 2,
  CustomerNickname: 3,
  CustomerEmail: 4,
  PostingUserNickname: 5,
  PostingUserEmail: 6,
} as const

export type TradeSearchBy = (typeof TradeSearchBy)[keyof typeof TradeSearchBy]

export type TradesQuery = {
  searchText?: string | null
  searchBy?: TradeSearchBy | null

  minTokenCost?: number | null
  maxTokenCost?: number | null

  createdFrom?: string | null
  createdTo?: string | null

  sortBy?: TradeSortBy | null
  readyForCompletion?: boolean | null
}

export type ItemInfo = {
  itemName: string
  quantity: number
}

export type InTradeUser = {
  userId: number
  nickname: string
  email: string
  offeredItems?: ItemInfo[] | null
}

export type TradeListItem = {
  tradeId: number
  offerId: number
  tokenCost: number
  tradeStatusId: number
  creationDate: string
  customer: InTradeUser
  postingUser: InTradeUser
  middlemanUserId?: number | null
  tokensOffered: number
  tokensWanted: number
}

export type MiddlemanTradesStats = {
  all: number
  completed: number
  myActive: number
  created: number
}

export type InTradeUserPhotos = {
  userId: number
  nickname: string
  email: string
  photos: string[]
}

export type TradeDetailsResponse = {
  hasBuyersItems: boolean
  hasSellersItems: boolean
  buyingUserPhotos: InTradeUserPhotos
  sellingUserPhotos: InTradeUserPhotos
}

export type CompleteAndMarkTradeRequest = {
  buyersID: number
  buyersGrade: number
  buyersDescription: string
  sellersID: number
  sellersGrade: number
  sellersDescription: string
}
