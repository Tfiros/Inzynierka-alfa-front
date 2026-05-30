import type { PagedResponse } from "@/shared/types/PagedType"
import type { DropdownResponse } from "@/shared/types/itemManagementTypes/DropdownTypes"
import type { GameDto } from "@/shared/types/itemManagementTypes/EntityDtos"
import type {
  CreateGameRequest,
  UpdateGameRequest,
} from "@/shared/types/itemManagementTypes/RequestResponseTypes"
import { del, get, postForm, putForm } from "../ApiClient"

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
  public static readonly create = async (req: CreateGameRequest) => {
    const form = new FormData()
    form.append("Name", req.name)
    form.append("GenreId", String(req.genreId))
    for (const rarity of req.itemRaritiesNames) {
      form.append("ItemRaritiesNames", rarity)
    }
    if (req.image) {
      form.append("Image", req.image)
    }
    return postForm<GameDto>(this.base, form)
  }

  // PUT /Games/{id}
  public static readonly update = async (
    id: number,
    req: UpdateGameRequest
  ) => {
    const form = new FormData()
    if (req.name !== undefined) {
      form.append("Name", req.name)
    }
    if (req.genreId !== undefined) {
      form.append("GenreId", String(req.genreId))
    }
    if (req.image) {
      form.append("Image", req.image)
    }
    return putForm<GameDto>(`${this.base}/${id}`, form)
  }

  // DELETE /Games/{id}/delete
  public static readonly softDelete = async (id: number) =>
    del<null>(`${this.base}/${id}/delete`)
}
