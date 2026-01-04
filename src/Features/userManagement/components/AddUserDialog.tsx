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
import { AuthService } from "@/shared/api/services/AuthService"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

function toDateInputValue(d: Date): string {
  const yyyy = String(d.getFullYear())
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function fromDateInputValue(value: string): Date {
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

const AddUserModal = ({ open, onOpenChange, onCreated }: Props) => {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [dto, setDto] = useState<RegisterRequestDto>({
    email: "",
    password: "",
    username: "",
    birthDate: new Date(),
  })

  useEffect(() => {
    if (!open) {
      setError(null)
      setSubmitting(false)
      setDto({
        email: "",
        password: "",
        username: "",
        birthDate: new Date(),
      })
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!dto.email.trim() || !dto.password || !dto.username.trim()) {
      setError("Uzupełnij email, username i hasło.")
      return
    }

    setSubmitting(true)
    try {
      const res = await AuthService.register({
        email: dto.email.trim(),
        password: dto.password,
        username: dto.username.trim(),
        birthDate: dto.birthDate,
      })

      if (!res.isSuccess) {
        setError(res.message ?? "Nie udało się dodać użytkownika.")
        return
      }

      onOpenChange(false)
      onCreated()
    } catch (err: any) {
      setError(err?.message ?? "Nie udało się dodać użytkownika.")
    } finally {
      setSubmitting(false)
    }
  }

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

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
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
export default AddUserModal
