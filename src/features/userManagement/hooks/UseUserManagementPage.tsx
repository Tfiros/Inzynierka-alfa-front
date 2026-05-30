import { useMemo } from "react"
import useUsersQueryState from "./UseUsersQueryState"
import useUserDialogs from "./UseUserDialog"
import useRefetchWithRetry from "./UseRefetchWithRetry"
import { UserListOrderBy } from "@/shared/types/userTypes/UserManagementTypes"
import useUsersData from "./UseUsersData"
import { useDebounceValue } from "@/shared/hooks/UseDebounceValue"

type Props = {
  pageSize?: number
}

const useUserManagementPage = ({ pageSize }: Props) => {
  const ps = pageSize ?? 10

  const { state, query, actions } = useUsersQueryState({
    pageSize: ps,
    initialOrderBy: UserListOrderBy.RegisteredAtDesc,
  })

  const searchDebounced = useDebounceValue(state.search, 300)

  const users = useUsersData({
    page: query.page,
    pageSize: query.pageSize,
    searchText: searchDebounced,
    orderBy: query.orderBy,
  })

  const dialogs = useUserDialogs()

  const refetchWithRetry = useRefetchWithRetry({
    refetch: users.refetch,
    waitsMs: [900],
  })

  const ui = useMemo(() => {
    return {
      headerProps: {
        loading: users.loading,
        onAddUser: dialogs.openAdd,
      },

      statsProps: {
        loading: users.loading,
        data: users.data,
      },

      toolbarProps: {
        search: state.search,
        onSearchChange: actions.onSearchChange,

        role: state.role,
        onRoleChange: actions.onRoleChange,

        orderBy: state.orderBy,
        onOrderByChange: actions.onOrderByChange,

        loading: users.loading,
        shownTo: users.shownTo,
        totalCount: users.totalCount,
      },

      tableProps: {
        loading: users.loading,
        error: users.error,
        items: users.items,
        onEdit: dialogs.openEdit,
        onDelete: dialogs.openDelete,
      },

      paginationProps: {
        loading: users.loading,
        page: state.page,
        totalPages: users.totalPages,
        shownFrom: users.shownFrom,
        shownTo: users.shownTo,
        totalCount: users.totalCount,
        onPrev: actions.onPrevPage,
        onNext: () => actions.onNextPage(users.totalPages),
      },

      dialogsProps: {
        edit: {
          open: dialogs.editOpen,
          user: dialogs.editUser,
          onOpenChange: dialogs.setEditOpen,
          onSaved: () => void refetchWithRetry(),
        },
        del: {
          open: dialogs.deleteOpen,
          user: dialogs.deleteUser,
          onOpenChange: dialogs.setDeleteOpen,
          onDeleted: () => void refetchWithRetry(),
        },
        add: {
          open: dialogs.addOpen,
          onOpenChange: dialogs.setAddOpen,
          onCreated: () => void refetchWithRetry(),
        },
      },
    }
  }, [
    users.loading,
    users.error,
    users.items,
    users.data,
    users.totalCount,
    users.totalPages,
    users.shownFrom,
    users.shownTo,
    state.search,
    state.role,
    state.orderBy,
    state.page,
    actions,
    dialogs,
    refetchWithRetry,
  ])

  return ui
}

export default useUserManagementPage
