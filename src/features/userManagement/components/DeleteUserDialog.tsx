import { useEffect } from "react"
import type { UserListItemDto } from "@/shared/types/userTypes/UserManagementTypes"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/alert-dialog"

import useDeleteUser from "../hooks/actions/UseDeleteUser"

type Props = {
  open: boolean
  user: UserListItemDto | null
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}

const DeleteUserDialog = (props: Props) => {
  const { open, user, onOpenChange, onDeleted } = props

  const { submitting, error, reset, deleteUser } = useDeleteUser()

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const handleDelete = async () => {
    if (!user) return

    const res = await deleteUser(user.auth0UserId)
    if (!res.isSuccess) return

    onOpenChange(false)
    onDeleted()
  }

  const deleteDisabled = submitting || !user

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usunąć użytkownika?</AlertDialogTitle>
          <AlertDialogDescription>
            Ta operacja jest nieodwracalna. Użytkownik{" "}
            <span className="font-medium text-foreground">
              {user?.name ?? user?.email ?? "—"}
            </span>{" "}
            zostanie usunięty.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && <div className="text-sm text-destructive">{error}</div>}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={submitting}
            className={submitting ? "" : "cursor-pointer"}
          >
            Anuluj
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              void handleDelete()
            }}
            disabled={submitting || !user}
            className={`bg-destructive text-destructive-foreground hover:bg-destructive/90 ${
              deleteDisabled ? "" : "cursor-pointer"
            }`}
          >
            {submitting ? "Usuwanie..." : "Usuń"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteUserDialog
