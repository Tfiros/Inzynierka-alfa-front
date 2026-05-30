import type { PagedResponse } from "@/shared/types/PagedType"
import { del, get, post, put } from "../ApiClient"
export type ItemRarityDropdownItemDto = { id: number; name: string }
export type ItemRarityDropdownResponse = { items: ItemRarityDropdownItemDto[] }

export type ItemRarityListItemDto = { id: number; name: string }

export type CreateItemRarityRequest = { gameId: number; rarityName: string }
export type UpdateItemRarityRequest = { rarityName: string }

export class ItemRaritiesService {
  private static readonly base = "/ItemRarity"

  public static readonly dropdown = async (
    gameId: number,
    searchText?: string
  ) =>
    get<ItemRarityDropdownResponse>(`${this.base}/dropdown/${gameId}`, {
      searchText,
    })

  public static readonly getPaged = async (params: {
    gameId: number
    page: number
    pageSize: number
    searchText?: string
  }) => get<PagedResponse<ItemRarityListItemDto>>(`${this.base}`, params)

  public static readonly create = async (body: CreateItemRarityRequest) =>
    post<number>(`${this.base}`, body)

  public static readonly update = async (
    id: number,
    body: UpdateItemRarityRequest
  ) => put<null>(`${this.base}/${id}`, body)

  public static readonly softDelete = async (id: number) =>
    del<null>(`${this.base}/${id}/delete`)
}
