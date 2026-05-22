import type { PagedResponse } from "@/shared/types/PagedType"
import type { DropdownResponse } from "@/shared/types/itemManagementTypes/DropdownTypes"
import type { ItemDto } from "@/shared/types/itemManagementTypes/EntityDtos"
import type {
  CreateItemRequest,
  UpdateItemRequest,
} from "@/shared/types/itemManagementTypes/RequestResponseTypes"
import { del, get, postForm, putForm } from "../ApiClient"
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
  public static readonly create = async (req: CreateItemRequest) => {
    const form = new FormData()
    form.append("Name", req.name)
    form.append("EstimatedTokenValue", String(req.estimatedTokenValue))
    form.append("GameId", String(req.gameId))
    form.append("ItemRarityId", String(req.itemRarityId))
    if (req.image) {
      form.append("Image", req.image)
    }
    return postForm<ItemDto>(this.base, form)
  }

  // PUT /Items/{id}
  public static readonly update = async (
    id: number,
    req: UpdateItemRequest
  ) => {
    const form = new FormData()
    if (req.name !== undefined) {
      form.append("Name", req.name)
    }

    if (req.estimatedTokenValue !== undefined) {
      form.append("EstimatedTokenValue", String(req.estimatedTokenValue))
    }
    if (req.itemRarityId !== undefined) {
      form.append("ItemRarityId", String(req.itemRarityId))
    }
    if (req.image) {
      form.append("Image", req.image)
    }
    return putForm<ItemDto>(`${this.base}/${id}`, form)
  }

  // DELETE /Items/{id}/delete
  public static readonly softDelete = async (id: number) =>
    del<null>(`${this.base}/${id}/delete`)
}
