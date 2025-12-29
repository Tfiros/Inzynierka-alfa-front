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
  gameId: number
  gameName: string
}
