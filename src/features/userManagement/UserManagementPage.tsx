import HeaderSection from "./sections/HeaderSection"
import StatsSection from "./sections/StatsSection"
import ToolbarSection from "./sections/ToolbarSection"
import TableSection from "./sections/TableSection"
import { DetailedPagination } from "@/shared/components/Pagination"
import EditUserDialog from "./components/EditUserDialog"
import DeleteUserDialog from "./components/DeleteUserDialog"
import AddUserDialog from "./components/AddUserDialog"

import useUserManagementPage from "./hooks/UseUserManagementPage"
const UserManagementPage = () => {
  const ui = useUserManagementPage({ pageSize: 10 })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <HeaderSection {...ui.headerProps} />
        <StatsSection {...ui.statsProps} />
        <ToolbarSection {...ui.toolbarProps} />
        <TableSection {...ui.tableProps} />
        <DetailedPagination {...ui.paginationProps} />
      </div>

      <EditUserDialog {...ui.dialogsProps.edit} />
      <DeleteUserDialog {...ui.dialogsProps.del} />
      <AddUserDialog {...ui.dialogsProps.add} />
    </div>
  )
}

export default UserManagementPage
