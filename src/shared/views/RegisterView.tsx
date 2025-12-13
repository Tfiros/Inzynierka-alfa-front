import PasswordInput from "@/shared/components/PasswordInput"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { ModalViewPropsTypes } from "../ModalTypes"
import { AuthService } from "@/api/services/AuthService"

const RegisterView = ({ onSwitch }: ModalViewPropsTypes) => {
  const [checked, setChecked] = useState(false)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [birthDate, setBirthDate] = useState<Date>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [okMsg, setOkMsg] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return

    setError(null)
    setOkMsg(null)

    if (!email.trim()) return setError("Podaj email.")
    if (!password) return setError("Podaj hasło.")
    if (!validatePassword(password))
      return setError(
        "Hasło musi mieć co najmniej 8 znaków i zawierać przynajmniej trzy z następujących: małą literę, dużą literę, cyfrę, znak specjalny."
      )
    if (!checked)
      return setError("Musisz zaakceptować regulamin i politykę prywatności.")

    setBusy(true)
    try {
      const res = await AuthService.register({
        email,
        password,
        username,
        birthDate,
      })

      setOkMsg(res?.message ?? "Konto zostało utworzone.")
      setTimeout(() => onSwitch("login"), 800)
    } catch (err: any) {
      const msg =
        err?.message ??
        err?.details?.error_description ??
        err?.details?.error ??
        "Rejestracja nie powiodła się."
      setError(msg)
    } finally {
      setBusy(false)
    }
  }
  const validatePassword = (password: string): boolean => {
    if (password.length < 8) return false
    if (password !== confirm) return false

    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasDigit = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)

    const typesCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(
      Boolean
    ).length

    if (typesCount < 3) {
      return false
    }

    return true
  }

  return (
    <>
      <form className="gap-y-4 flex flex-col mt-4" onSubmit={onSubmit}>
        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            autoComplete="email"
            disabled={busy}
          />
        </div>
        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="birthDate">Data urodzenia</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !birthDate && "text-muted-foreground"
                )}
                disabled={busy}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {birthDate ? format(birthDate, "dd.MM.yyyy") : "Wybierz datę"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={birthDate}
                onSelect={setBirthDate}
                autoFocus
                captionLayout="dropdown"
                startMonth={new Date(1900, 0)}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="username">Nazwa Użytkownika</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            disabled={busy}
          />
        </div>

        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="password">Hasło</Label>
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.currentTarget.value)
            }
            autoComplete="new-password"
            disabled={busy}
          />
        </div>

        <div className="gap-y-1 flex flex-col">
          <Label htmlFor="confirmPassword">Potwierdź Hasło</Label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={confirm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirm(e.currentTarget.value)
            }
            autoComplete="new-password"
            disabled={busy}
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={checked}
            onCheckedChange={(val) => setChecked(!!val)}
            disabled={busy}
          />
          <Label htmlFor="terms" className="text-sm">
            Akceptuję{" "}
            <a href="#" className="underline">
              Regulamin
            </a>{" "}
            oraz
            <a href="#" className="underline">
              Politykę Prywatności
            </a>
            .
          </Label>
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {okMsg && (
          <p className="text-sm text-green-700" role="status">
            {okMsg}
          </p>
        )}

        <Button type="submit" className="w-full cursor-pointer" disabled={busy}>
          {busy ? "Rejestrowanie…" : "Zarejestruj się"}
        </Button>
      </form>

      <p className="text-center text-sm mt-4">
        Masz już konto?{" "}
        <button
          onClick={() => onSwitch("login")}
          className="text-blue-500 cursor-pointer"
          disabled={busy}
        >
          Zaloguj się
        </button>
      </p>
    </>
  )
}

export default RegisterView
