export enum UserListOrderBy {
  NicknameAsc = 1,
  NicknameDesc = 2,
  EmailAsc = 3,
  EmailDesc = 4,
  RegisteredAtAsc = 5,
  RegisteredAtDesc = 6,
}

export type UserListQuery = {
  page: number
  pageSize: number
  searchText?: string
  orderBy?: UserListOrderBy
  role?: string
  registeredFrom?: string
  registeredTo?: string
}

export type UserListItemDto = {
  auth0UserId: string
  email: string
  name: string | null
  registeredAt: string
  roles: string[]
}

export type UserListPagedResponse = {
  page: number
  pageSize: number
  totalPages: number
  totalCount: number
  items: UserListItemDto[]
  registeredLastMonthCount: number
  middlemenCount: number
}
