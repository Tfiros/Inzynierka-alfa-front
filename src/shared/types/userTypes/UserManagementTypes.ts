export const UserListOrderBy = {
  NicknameAsc: 1,
  NicknameDesc: 2,
  EmailAsc: 3,
  EmailDesc: 4,
  RegisteredAtAsc: 5,
  RegisteredAtDesc: 6,
} as const
export type UserListOrderBy =
  (typeof UserListOrderBy)[keyof typeof UserListOrderBy]

export type UserListQuery = {
  page: number
  pageSize: number
  searchText?: string
  orderBy?: UserListOrderBy
  registeredFrom?: string
  registeredTo?: string
}

export type UserListItemDto = {
  auth0UserId: string
  email: string
  name: string | null
  registeredAt: string
}

export type UserListPagedResponse = {
  page: number
  pageSize: number
  totalPages: number
  totalCount: number
  elements: UserListItemDto[]
  registeredLastMonthCount: number
  middlemenCount: number
  totalUsers: number
}

export type UpdateUserRequestDto = {
  authZeroUserId: string
  email?: string | null
  profileDescription?: string | null
  newPassword?: string | null
  roles?: string[] | null
  nickname?: string | null
}

export type DeleteUserRequestDto = {
  authZeroUserId: string
}

export type UserDetailsDto = {
  profileDescription: string | null
  roles: string[]
}
