import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/dialog"
import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
import { Checkbox } from "@/shared/components/checkbox"
import type { UserListItemDto } from "@/shared/types/userTypes/UserManagementTypes"
import { Label } from "@/shared/components/label"
import useUpdateUser from "../hooks/actions/UseUpdateUser"
import useEditUser from "../hooks/actions/UseEditUser"

const ALL_ROLES = ["Admin", "Middleman"]

type Props = {
  open: boolean
  user: UserListItemDto | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

const EditUserDialog = ({ open, user, onOpenChange, onSaved }: Props) => {
  const { submitting, error, reset, updateUser } = useUpdateUser()

  const form = useEditUser({
    open,
    user,
    resetRequestState: reset,
    requestError: error,
  })

  const handleSave = async () => {
    if (!user || !form.body) return

    form.setLocalError(null)

    if (!form.canSave) {
      form.setLocalError("Brak zmian do zapisania.")
      return
    }

    const res = await updateUser(form.body)
    if (!res.isSuccess) return

    onOpenChange(false)
    onSaved()
  }

  const savingDisabled = submitting || form.loadingDetails || !user

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edytuj użytkownika</DialogTitle>
          <DialogDescription>
            Zaktualizuj dane użytkownika, opis profilu, hasło lub role.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="nickname">Nickname</Label>
          <Input
            id="nickname"
            value={form.nickname}
            onChange={(e) => form.setNickname(e.target.value)}
            placeholder="Np. Tomasz Kamiński"
            disabled={submitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profileDescription">Opis profilu</Label>
          <Input
            id="profileDescription"
            value={form.profileDescription}
            onChange={(e) => form.setProfileDescription(e.target.value)}
            placeholder="Opis profilu użytkownika"
            disabled={submitting || form.loadingDetails}
          />
          <p className="text-xs text-muted-foreground">
            Opis zostanie zapisany tylko w lokalnym profilu użytkownika.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={form.email}
            onChange={(e) => form.setEmail(e.target.value)}
            placeholder="email@domain.com"
            disabled={submitting}
          />
          <p className="text-xs text-muted-foreground">
            Email poleci do API tylko jeśli go faktycznie zmienisz.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pwd">Nowe hasło</Label>
          <Input
            id="pwd"
            type="password"
            value={form.newPassword}
            onChange={(e) => form.setNewPassword(e.target.value)}
            placeholder="Pozostaw puste, aby nie zmieniać"
            disabled={submitting}
          />
          <p className="text-xs text-muted-foreground">
            Wpisz nowe hasło tylko jeśli chcesz je zmienić.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Role</Label>

          <div className="rounded-lg border p-3">
            {form.loadingDetails ? (
              <p className="text-sm text-muted-foreground">
                Pobieranie szczegółów użytkownika...
              </p>
            ) : (
              <div className="space-y-3">
                {ALL_ROLES.map((r) => {
                  const checked = form.roles.some(
                    (x) => x.toLowerCase() === r.toLowerCase()
                  )

                  return (
                    <div key={r} className="flex items-center gap-3">
                      <Checkbox
                        id={`role-${r}`}
                        checked={checked}
                        disabled={submitting || form.loadingDetails}
                        onCheckedChange={(v) => form.toggleRole(r, Boolean(v))}
                      />
                      <Label htmlFor={`role-${r}`} className="font-normal">
                        {r}
                      </Label>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Zaznacz wszystkie role, które powinien mieć użytkownik.
          </p>
        </div>

        {form.displayError && (
          <div className="text-sm text-destructive">{form.displayError}</div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Anuluj
          </Button>

          <Button onClick={handleSave} disabled={savingDisabled}>
            {submitting
              ? "Zapisywanie..."
              : form.loadingDetails
                ? "Pobieranie szczegółów..."
                : "Zapisz zmiany"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditUserDialog
