import type {
  UserListPagedResponse,
  UserListQuery,
  UpdateUserRequestDto,
  DeleteUserRequestDto,
  UserDetaulsDto,
} from "@/shared/types/userTypes/UserManagementTypes"
import { get, patch } from "../ApiClient"
import type { ApiResult } from "../ApiResult"
import api from "../Api"

function buildUserListQs(q: UserListQuery) {
  const p = new URLSearchParams()

  p.set("Page", String(q.page))
  p.set("PageSize", String(q.pageSize))

  if (q.searchText?.trim()) p.set("SearchText", q.searchText.trim())
  if (q.orderBy !== undefined) p.set("OrderBy", String(q.orderBy))

  if (q.registeredFrom) p.set("RegisteredFrom", q.registeredFrom)
  if (q.registeredTo) p.set("RegisteredTo", q.registeredTo)

  const s = p.toString()
  return s ? `?${s}` : ""
}

export class UserManagementService {
  private static readonly base = "/UserManagement"

  public static readonly getUsers = async (query: UserListQuery) =>
    get<UserListPagedResponse>(
      `${this.base}${buildUserListQs(query)}`
    ) as Promise<ApiResult<UserListPagedResponse>>

  public static readonly getUserDetails = async (authZeroUserId: string) =>
    get<UserDetaulsDto>(`${this.base}/${authZeroUserId}/details`) as Promise<
      ApiResult<UserDetaulsDto>
    >

  public static readonly updateUser = async (body: UpdateUserRequestDto) =>
    patch<string>(`${this.base}`, body)

  public static readonly deleteUser = async (
    body: DeleteUserRequestDto
  ): Promise<ApiResult<string>> => {
    const res = await api.delete(this.base, {
      data: body,
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true,
    })

    if (res.status === 204) {
      return {
        isSuccess: true,
        status: 204,
        data: null as any,
        message: "User deleted successfully",
      }
    }
    return res.data as ApiResult<string>
  }
}
