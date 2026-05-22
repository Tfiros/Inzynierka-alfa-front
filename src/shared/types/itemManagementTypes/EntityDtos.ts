export type GenreDto = { id: number; name: string }
export type GameDto = {
  id: number
  name: string
  photo_URL: string
  genre_name?: string
}
export type ItemDto = {
  id: number
  name: string
  photo_URL: string
  estimatedTokenValue: number
  gameId: number
  gameName: string
  itemRarityId: number
}
