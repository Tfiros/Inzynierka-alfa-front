import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/Dialog"
import { Button } from "@/shared/components/Button"
import { Input } from "@/shared/components/Input"

import { Checkbox } from "@/shared/components/Checkbox"
import type {
  UpdateUserRequestDto,
  UserListItemDto,
} from "@/shared/types/userTypes/UserManagementTypes"
import { Label } from "@/shared/components/Label"
import { UserManagementService } from "@/shared/api/services/UserManagementService"

const ALL_ROLES = ["Admin", "Middleman"]

type Props = {
  open: boolean
  user: UserListItemDto | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

const EditUserDialog = ({ open, user, onOpenChange, onSaved }: Props) => {
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [roles, setRoles] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !user) return
    setNickname(user.name ?? "")
    setEmail(user.email ?? "")
    setNewPassword("")
    setRoles(user.roles ?? [])
    setError(null)
  }, [open, user])

  const toggleRole = (r: string, checked: boolean) => {
    setRoles((prev) => {
      const has = prev.some((x) => x.toLowerCase() === r.toLowerCase())
      if (checked && !has) return [...prev, r]
      if (!checked && has)
        return prev.filter((x) => x.toLowerCase() !== r.toLowerCase())
      return prev
    })
  }

  const handleSave = async () => {
    if (!user) return

    setSubmitting(true)
    setError(null)

    const body: UpdateUserRequestDto = {
      authZeroUserId: user.auth0UserId,
      nickname: nickname.trim() ? nickname.trim() : null,
      email: email.trim() ? email.trim() : null,
      newPassword: newPassword.trim() ? newPassword.trim() : null,
      roles: roles,
    }

    try {
      const res = await UserManagementService.updateUser(body)

      if (!res.isSuccess) {
        setError(res.message ?? "Nie udało się zaktualizować użytkownika.")
        return
      }

      onOpenChange(false)
      onSaved()
    } catch (e: any) {
      setError(e?.message ?? "Nie udało się zaktualizować użytkownika.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edytuj użytkownika</DialogTitle>
          <DialogDescription>
            Zaktualizuj dane użytkownika, zmień hasło lub zarządzaj rolami.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="nickname">Nickname</Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Np. Tomasz Kamiński"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@domain.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pwd">Nowe hasło</Label>
          <Input
            id="pwd"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Pozostaw puste, aby nie zmieniać"
          />
          <p className="text-xs text-muted-foreground">
            Wpisz nowe hasło tylko jeśli chcesz je zmienić
          </p>
        </div>

        <div className="space-y-2">
          <Label>Role</Label>

          <div className="rounded-lg border p-3">
            <div className="space-y-3">
              {ALL_ROLES.map((r) => {
                const checked = roles.some(
                  (x) => x.toLowerCase() === r.toLowerCase()
                )
                return (
                  <div key={r} className="flex items-center gap-3">
                    <Checkbox
                      id={`role-${r}`}
                      checked={checked}
                      onCheckedChange={(v) => toggleRole(r, Boolean(v))}
                    />
                    <Label htmlFor={`role-${r}`} className="font-normal">
                      {r}
                    </Label>
                  </div>
                )
              })}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Zaznacz wszystkie role, które powinien mieć użytkownik
          </p>
        </div>

        {error && <div className="text-sm text-destructive">{error}</div>}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Anuluj
          </Button>
          <Button onClick={handleSave} disabled={submitting}>
            {submitting ? "Zapisywanie..." : "Zapisz zmiany"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default EditUserDialog
