import { useState } from "react"
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
import { UserManagementService } from "@/shared/api/services/UserManagementService"

type Props = {
  open: boolean
  user: UserListItemDto | null
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}

const DeleteUserDialog = ({ open, user, onOpenChange, onDeleted }: Props) => {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!user) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await UserManagementService.deleteUser({
        authZeroUserId: user.auth0UserId,
      })

      if (!res.isSuccess) {
        setError(res.message ?? "Nie udało się usunąć użytkownika.")
        return
      }

      onOpenChange(false)
      onDeleted()
    } catch (e: any) {
      setError(e?.message ?? "Nie udało się usunąć użytkownika.")
    } finally {
      setSubmitting(false)
    }
  }

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
          <AlertDialogCancel disabled={submitting}>Anuluj</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              void handleDelete()
            }}
            disabled={submitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {submitting ? "Usuwanie..." : "Usuń"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default DeleteUserDialog
