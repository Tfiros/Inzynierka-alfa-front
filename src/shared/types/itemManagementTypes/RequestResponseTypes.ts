export type CreateGenreRequest = { name: string }
export type UpdateGenreRequest = { name: string }

export type CreateGameRequest = { name: string; genreId: number }
export type UpdateGameRequest = { name?: string; genreId?: number }

export type CreateItemRequest = { name: string; gameId: number }
export type UpdateItemRequest = { name?: string; gameId?: number }
