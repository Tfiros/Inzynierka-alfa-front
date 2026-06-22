import { useCallback, useEffect, useMemo, useState } from "react"
import type {
  UserListPagedResponse,
  UserListItemDto,
  UserListOrderBy,
} from "@/shared/types/userTypes/UserManagementTypes"
import { UserManagementService } from "@/shared/api/services/UserManagementService"
import { extractErrorMessage } from "@/shared/utilities/errorHandlers"

type Props = {
  page: number
  pageSize: number
  searchText: string
  orderBy: UserListOrderBy
}

type Result = {
  loading: boolean
  error: string | null
  data: UserListPagedResponse | null

  totalCount: number
  totalPages: number
  items: UserListItemDto[]
  shownFrom: number
  shownTo: number

  refetch: () => Promise<void>
}

const useUsersData = ({
  page,
  pageSize,
  searchText,
  orderBy,
}: Props): Result => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<UserListPagedResponse | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const s = searchText.trim()

      const res = await UserManagementService.getUsers({
        page,
        pageSize,
        searchText: s ? s : undefined,
        orderBy,
      })

      if (!res.isSuccess || !res.data) {
        setData(null)
        setError(res.message ?? "Nie udało się pobrać użytkowników.")
        return
      }

      setData(res.data)
    } catch (e) {
      setData(null)
      setError(extractErrorMessage(e, "Nie udało się pobrać użytkowników."))
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, searchText, orderBy])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  const computed = useMemo(() => {
    const totalCount = data?.totalCount ?? 0
    const totalPages = data?.totalPages ?? 1
    const items = data?.elements ?? []
    const shownFrom = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
    const shownTo = Math.min(page * pageSize, totalCount)

    return { totalCount, totalPages, items, shownFrom, shownTo }
  }, [data, page, pageSize])

  return {
    loading,
    error,
    data,
    ...computed,
    refetch: fetchUsers,
  }
}

export default useUsersData
