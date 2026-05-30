import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/dialog"
import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
import type { RegisterRequestDto } from "@/shared/types/authTypes/AuthRequestTypes"
import { Label } from "@radix-ui/react-label"

import useAddUser from "../hooks/actions/UseAddUser"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

const toDateInputValue = (d: Date): string => {
  const yyyy = String(d.getFullYear())
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

const fromDateInputValue = (value: string): Date => {
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

const AddUserDialog = (props: Props) => {
  const { open, onOpenChange, onCreated } = props

  const { submitting, error, reset, addUser } = useAddUser()

  const [localError, setLocalError] = useState<string | null>(null)
  const [dto, setDto] = useState<RegisterRequestDto>({
    email: "",
    password: "",
    username: "",
    birthDate: new Date(),
  })

  useEffect(() => {
    if (!open) {
      reset()
      setLocalError(null)
      setDto({
        email: "",
        password: "",
        username: "",
        birthDate: new Date(),
      })
    }
  }, [open, reset])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocalError(null)

    const email = dto.email.trim()
    const username = dto.username.trim()

    if (!email || !dto.password || !username) {
      setLocalError("Uzupełnij email, username i hasło.")
      return
    }

    const res = await addUser({
      email,
      password: dto.password,
      username,
      birthDate: dto.birthDate,
    })

    if (!res.isSuccess) return

    onOpenChange(false)
    onCreated()
  }

  const displayError = localError ?? error

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Dodaj użytkownika</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={dto.email}
              onChange={(e) => setDto((s) => ({ ...s, email: e.target.value }))}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={dto.username}
              onChange={(e) =>
                setDto((s) => ({ ...s, username: e.target.value }))
              }
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Data urodzenia</Label>
            <Input
              id="birthDate"
              type="date"
              value={toDateInputValue(dto.birthDate)}
              onChange={(e) =>
                setDto((s) => ({
                  ...s,
                  birthDate: fromDateInputValue(e.target.value),
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              type="password"
              value={dto.password}
              onChange={(e) =>
                setDto((s) => ({ ...s, password: e.target.value }))
              }
              autoComplete="new-password"
            />
          </div>

          {displayError && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {displayError}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Dodawanie..." : "Zatwierdź"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddUserDialog
