import { del, get, post, put } from "@/api/ApiClient"
import type { PagedResponse } from "@/shared/types/PagedType"
import type { DropdownResponse } from "@/shared/types/itemManagementTypes/DropdownTypes"
import type { GameDto } from "@/shared/types/itemManagementTypes/EntityDtos"
import type {
  CreateGameRequest,
  UpdateGameRequest,
} from "@/shared/types/itemManagementTypes/RequestResponseTypes"

export class GamesService {
  private static readonly base = "/Games"

  // GET /Games?page=&pageSize=&genreId=&searchText=
  public static readonly getPaged = async (args: {
    page: number
    pageSize: number
    genreId: number
    searchText?: string
  }) => get<PagedResponse<GameDto>>(this.base, args)

  // GET /Games/dropdown?searchText=
  public static readonly dropdown = async (searchText?: string) =>
    get<DropdownResponse>(`${this.base}/dropdown`, { searchText })

  // POST /Games
  public static readonly create = async (req: CreateGameRequest) =>
    post<GameDto>(this.base, req)

  // PUT /Games/{id}
  public static readonly update = async (id: number, req: UpdateGameRequest) =>
    put<GameDto>(`${this.base}/${id}`, req)

  // DELETE /Games/{id}/delete
  public static readonly softDelete = async (id: number) =>
    del<null>(`${this.base}/${id}/delete`)
}
