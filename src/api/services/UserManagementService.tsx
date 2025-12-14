import { get } from "@/api/ApiClient"
import type { ApiResult } from "@/api/ApiResult"
import type {
  UserListPagedResponse,
  UserListQuery,
} from "@/shared/types/userTypes/UserManagementTypes"

function buildUserListQs(q: UserListQuery) {
  const p = new URLSearchParams()

  p.set("Page", String(q.page))
  p.set("PageSize", String(q.pageSize))

  if (q.searchText?.trim()) p.set("SearchText", q.searchText.trim())
  if (q.orderBy !== undefined) p.set("OrderBy", String(q.orderBy))
  if (q.role?.trim()) p.set("Role", q.role.trim())

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
}
