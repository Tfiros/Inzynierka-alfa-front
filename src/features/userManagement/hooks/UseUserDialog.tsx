import { useCallback, useState } from "react"
import type { UserListItemDto } from "@/shared/types/userTypes/UserManagementTypes"

type Result = {
  addOpen: boolean
  setAddOpen: (open: boolean) => void

  editOpen: boolean
  setEditOpen: (open: boolean) => void
  editUser: UserListItemDto | null

  deleteOpen: boolean
  setDeleteOpen: (open: boolean) => void
  deleteUser: UserListItemDto | null

  openAdd: () => void
  openEdit: (u: UserListItemDto) => void
  openDelete: (u: UserListItemDto) => void
}

const useUserDialogs = (): Result => {
  const [addOpen, setAddOpen] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [editUser, setEditUser] = useState<UserListItemDto | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteUser, setDeleteUser] = useState<UserListItemDto | null>(null)

  const openAdd = useCallback(() => setAddOpen(true), [])

  const openEdit = useCallback((u: UserListItemDto) => {
    setEditUser(u)
    setEditOpen(true)
  }, [])

  const openDelete = useCallback((u: UserListItemDto) => {
    setDeleteUser(u)
    setDeleteOpen(true)
  }, [])

  return {
    addOpen,
    setAddOpen,

    editOpen,
    setEditOpen,
    editUser,

    deleteOpen,
    setDeleteOpen,
    deleteUser,

    openAdd,
    openEdit,
    openDelete,
  }
}

export default useUserDialogs
