import { useEffect, useMemo, useState } from "react"
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
import type {
  UpdateUserRequestDto,
  UserListItemDto,
} from "@/shared/types/userTypes/UserManagementTypes"
import { Label } from "@/shared/components/label"

import useUpdateUser from "../hooks/actions/UseUpdateUser"

const ALL_ROLES = ["Admin", "Middleman"]

type Props = {
  open: boolean
  user: UserListItemDto | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

const norm = (v: string) => v.trim()
const normLower = (v: string) => v.trim().toLowerCase()

const EditUserDialog = (props: Props) => {
  const { open, user, onOpenChange, onSaved } = props

  const { submitting, error, reset, updateUser } = useUpdateUser()

  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [roles, setRoles] = useState<string[]>([])
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !user) return

    reset()
    setLocalError(null)

    setNickname(user.name ?? "")
    setEmail(user.email ?? "")
    setNewPassword("")
    setRoles(user.roles ?? [])
  }, [open, user, reset])

  useEffect(() => {
    if (!open) {
      reset()
      setLocalError(null)
    }
  }, [open, reset])

  const toggleRole = (r: string, checked: boolean) => {
    setRoles((prev) => {
      const has = prev.some((x) => x.toLowerCase() === r.toLowerCase())
      if (checked && !has) return [...prev, r]
      if (!checked && has)
        return prev.filter((x) => x.toLowerCase() !== r.toLowerCase())
      return prev
    })
  }

  const body = useMemo<UpdateUserRequestDto | null>(() => {
    if (!user) return null

    const nextNick = norm(nickname)
    const nextEmail = norm(email)
    const nextPwd = norm(newPassword)

    const originalEmail = norm(user.email ?? "")
    const originalNick = norm(user.name ?? "")

    const emailChanged =
      nextEmail.length > 0 && normLower(nextEmail) !== normLower(originalEmail)

    const nickChanged = nextNick.length > 0 && nextNick !== originalNick

    return {
      authZeroUserId: user.auth0UserId,
      nickname: nickChanged ? nextNick : null,
      email: emailChanged ? nextEmail : null,
      newPassword: nextPwd ? nextPwd : null,
      roles: roles,
    }
  }, [user, nickname, email, newPassword, roles])

  const handleSave = async () => {
    if (!user || !body) return

    setLocalError(null)

    const hasSomething =
      Boolean(body.nickname) ||
      Boolean(body.email) ||
      Boolean(body.newPassword) ||
      Array.isArray(body.roles)

    if (!hasSomething) {
      setLocalError("Brak zmian do zapisania.")
      return
    }

    const res = await updateUser(body)
    if (!res.isSuccess) return

    onOpenChange(false)
    onSaved()
  }

  const displayError = localError ?? error

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
          <p className="text-xs text-muted-foreground">
            Email poleci do API tylko jeśli go faktycznie zmienisz.
          </p>
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

        {displayError && (
          <div className="text-sm text-destructive">{displayError}</div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Anuluj
          </Button>
          <Button onClick={handleSave} disabled={submitting || !user}>
            {submitting ? "Zapisywanie..." : "Zapisz zmiany"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditUserDialog
