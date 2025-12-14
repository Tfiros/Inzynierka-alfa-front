import { useCallback, useEffect, useState } from "react"
import { UserManagementService } from "@/api/services/UserManagementService"
import {
  UserListOrderBy,
  type UserListItemDto,
  type UserListPagedResponse,
} from "@/shared/types/userTypes/UserManagementTypes"
import { DeleteUserDialog } from "./components/DeleteUserDialog"
import { HeaderSection } from "./sections/HeaderSection"
import { StatsSection } from "./sections/StatsSection"
import { ToolbarSection } from "./sections/ToolbarSection"
import { TableSection } from "./sections/TableSection"
import { PaginationSection } from "./sections/PaginationSection"
import { EditUserDialog } from "./components/EditUserDialog"
import { AddUserModal } from "./components/AddUserDialog"
export const UserManagementPage = () => {
  const pageSize = 10

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchDebounced, setSearchDebounced] = useState("")
  const [role, setRole] = useState<string | null>(null)
  const [orderBy, setOrderBy] = useState<UserListOrderBy>(
    UserListOrderBy.RegisteredAtDesc
  )

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<UserListPagedResponse | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editUser, setEditUser] = useState<UserListItemDto | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteUser, setDeleteUser] = useState<UserListItemDto | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setSearchDebounced(search), 300)
    return () => window.clearTimeout(t)
  }, [search])

  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1
  const items = data?.items ?? []

  const shownFrom = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const shownTo = Math.min(page * pageSize, totalCount)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const s = searchDebounced.trim()

      const res = await UserManagementService.getUsers({
        page,
        pageSize,
        searchText: s ? s : undefined,
        role: role ?? undefined,
        orderBy,
      })

      if (!res.isSuccess || !res.data) {
        setData(null)
        setError(res.message ?? "Nie udało się pobrać użytkowników.")
        return
      }

      setData(res.data)
    } catch (e: any) {
      setData(null)
      setError(e?.message ?? "Nie udało się pobrać użytkowników.")
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, searchDebounced, role, orderBy])
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const refetchUsersWithRetry = useCallback(async () => {
    const waits = [900]

    for (const w of waits) {
      if (w) await delay(w)
      await fetchUsers()
    }
  }, [fetchUsers])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  const handleSearchChange = (value: string) => {
    setPage(1)
    setSearch(value)
  }

  const handleRoleChange = (next: string | null) => {
    setPage(1)
    setRole(next)
  }

  const handleOrderByChange = (next: UserListOrderBy) => {
    setPage(1)
    setOrderBy(next)
  }

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1))
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1))

  const openEdit = (u: UserListItemDto) => {
    setEditUser(u)
    setEditOpen(true)
  }
  const openDelete = (u: UserListItemDto) => {
    setDeleteUser(u)
    setDeleteOpen(true)
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <HeaderSection loading={loading} onAddUser={() => setAddOpen(true)} />

        <StatsSection loading={loading} data={data} />

        <ToolbarSection
          search={search}
          onSearchChange={handleSearchChange}
          role={role}
          onRoleChange={handleRoleChange}
          orderBy={orderBy}
          onOrderByChange={handleOrderByChange}
          loading={loading}
          shownTo={shownTo}
          totalCount={totalCount}
        />

        <TableSection
          loading={loading}
          error={error}
          items={items}
          onEdit={openEdit}
          onDelete={openDelete}
        />

        <PaginationSection
          loading={loading}
          page={page}
          totalPages={totalPages}
          shownFrom={shownFrom}
          shownTo={shownTo}
          totalCount={totalCount}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
        />
      </div>

      <EditUserDialog
        open={editOpen}
        user={editUser}
        onOpenChange={setEditOpen}
        onSaved={() => void refetchUsersWithRetry()}
      />
      <DeleteUserDialog
        open={deleteOpen}
        user={deleteUser}
        onOpenChange={setDeleteOpen}
        onDeleted={() => void refetchUsersWithRetry()}
      />
      <AddUserModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreated={() => void refetchUsersWithRetry()}
      />
    </div>
  )
}
