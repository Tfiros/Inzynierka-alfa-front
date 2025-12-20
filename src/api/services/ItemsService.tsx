import { del, get, post, put } from "@/api/ApiClient"
import type { PagedResponse } from "@/shared/types/PagedType"
import type { DropdownResponse } from "@/shared/types/itemManagementTypes/DropdownTypes"
import type { ItemDto } from "@/shared/types/itemManagementTypes/EntityDtos"
import type {
  CreateItemRequest,
  UpdateItemRequest,
} from "@/shared/types/itemManagementTypes/RequestResponseTypes"
export class ItemsService {
  private static readonly base = "/Items"

  // GET /Items?page=&pageSize=&gameId=&searchText=
  public static readonly getPaged = async (args: {
    page: number
    pageSize: number
    gameId: number
    searchText?: string
  }) => get<PagedResponse<ItemDto>>(this.base, args)

  // GET /Items/dropdown?gameId=&searchText=
  public static readonly dropdown = async (
    gameId: number,
    searchText?: string
  ) => get<DropdownResponse>(`${this.base}/dropdown`, { gameId, searchText })

  // POST /Items
  public static readonly create = async (req: CreateItemRequest) =>
    post<ItemDto>(this.base, req)

  // PUT /Items/{id}
  public static readonly update = async (id: number, req: UpdateItemRequest) =>
    put<ItemDto>(`${this.base}/${id}`, req)

  // DELETE /Items/{id}/delete
  public static readonly softDelete = async (id: number) =>
    del<null>(`${this.base}/${id}/delete`)
}
