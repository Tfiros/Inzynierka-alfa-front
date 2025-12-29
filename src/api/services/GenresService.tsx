import { del, get, post, put } from "@/api/ApiClient"
import type { PagedResponse } from "@/shared/types/PagedType"
import type { DropdownResponse } from "@/shared/types/itemManagementTypes/DropdownTypes"
import type { GenreDto } from "@/shared/types/itemManagementTypes/EntityDtos"
import type {
  CreateGenreRequest,
  UpdateGenreRequest,
} from "@/shared/types/itemManagementTypes/RequestResponseTypes"
export class GenresService {
  private static readonly base = "/Genres"

  // GET /Genres?page=&pageSize=&searchText=
  public static readonly getPaged = async (args: {
    page: number
    pageSize: number
    searchText?: string
  }) => get<PagedResponse<GenreDto>>(this.base, args)

  // GET /Genres/dropdown?searchText=
  public static readonly dropdown = async (searchText?: string) =>
    get<DropdownResponse>(`${this.base}/dropdown`, { searchText })

  // POST /Genres
  public static readonly create = async (req: CreateGenreRequest) =>
    post<GenreDto>(this.base, req)

  // PUT /Genres/{id}
  public static readonly update = async (id: number, req: UpdateGenreRequest) =>
    put<GenreDto>(`${this.base}/${id}`, req)

  // DELETE /Genres/{id}/delete
  public static readonly softDelete = async (id: number) =>
    del<null>(`${this.base}/${id}/delete`)
}
