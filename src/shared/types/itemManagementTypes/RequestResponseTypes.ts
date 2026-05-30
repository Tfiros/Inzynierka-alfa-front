export type CreateGenreRequest = { name: string }
export type UpdateGenreRequest = { name: string }

export type CreateGameRequest = {
  name: string
  genreId: number
  itemRaritiesNames: string[]
  image?: File | null
}
export type UpdateGameRequest = {
  name?: string
  genreId?: number
  image?: File | null
}

export type CreateItemRequest = {
  name: string
  estimatedTokenValue: number
  gameId: number
  itemRarityId: number
  image?: File | null
}

export type UpdateItemRequest = {
  name?: string
  estimatedTokenValue?: number
  itemRarityId?: number
  image?: File | null
}
