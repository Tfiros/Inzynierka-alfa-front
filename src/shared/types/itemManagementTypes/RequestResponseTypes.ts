export type CreateGenreRequest = { name: string }
export type UpdateGenreRequest = { name: string }

export type CreateGameRequest = {
  name: string
  genreId: number
  itemRaritiesNames: string[]
}
export type UpdateGameRequest = { name?: string; genreId?: number }

export type CreateItemRequest = {
  name: string
  estimatedTokenValue: number
  gameId: number
  itemRarityId: number
}

export type UpdateItemRequest = {
  name?: string
  estimatedTokenValue?: number
  itemRarityId?: number
}
