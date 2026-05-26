import { useMemo, useState } from "react"
import { UserListOrderBy } from "@/shared/types/userTypes/UserManagementTypes"

type Props = {
  pageSize: number
  initialOrderBy: UserListOrderBy
}

export type UsersQueryState = {
  page: number
  search: string
  role: string | null
  orderBy: UserListOrderBy
}

export type UsersQueryActions = {
  setPage: (page: number) => void
  onPrevPage: () => void
  onNextPage: (totalPages: number) => void

  onSearchChange: (v: string) => void
  onRoleChange: (role: string | null) => void
  onOrderByChange: (orderBy: UserListOrderBy) => void
}

const UseUsersQueryState = ({ pageSize, initialOrderBy }: Props) => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState<string | null>(null)
  const [orderBy, setOrderBy] = useState<UserListOrderBy>(initialOrderBy)

  const actions = useMemo<UsersQueryActions>(() => {
    return {
      setPage,

      onPrevPage: () => setPage((p) => Math.max(1, p - 1)),
      onNextPage: (totalPages: number) =>
        setPage((p) => Math.min(totalPages, p + 1)),

      onSearchChange: (v: string) => {
        setPage(1)
        setSearch(v)
      },

      onRoleChange: (next: string | null) => {
        setPage(1)
        setRole(next)
      },

      onOrderByChange: (next: UserListOrderBy) => {
        setPage(1)
        setOrderBy(next)
      },
    }
  }, [])

  const state = useMemo<UsersQueryState>(
    () => ({ page, search, role, orderBy }),
    [page, search, role, orderBy]
  )

  const query = useMemo(
    () => ({ page, pageSize, search, role, orderBy }),
    [page, pageSize, search, role, orderBy]
  )

  return { pageSize, state, query, actions }
}

export default UseUsersQueryState
