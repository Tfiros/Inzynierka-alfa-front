import PasswordInput from "@/shared/components/PasswordInput"

import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
import { Checkbox } from "@/shared/components/checkbox"
import { Calendar } from "@/shared/components/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/shared/lib/utils"
import type { ModalViewPropsTypes } from "../../utilities/Auth/ModalTypes"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/popover"
import { Label } from "../../components/label"
import { useRegister } from "./hooks/UseRegister"
import { Link } from "react-router-dom"

const RegisterView = ({ onSwitch }: ModalViewPropsTypes) => {
  const {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    confirm,
    setConfirm,
    birthDate,
    setBirthDate,
    checked,
    setChecked,
    busy,
    error,
    okMsg,
    submit,
  } = useRegister(onSwitch)

  return (
    <>
      <form className="gap-y-4 flex flex-col mt-4" onSubmit={submit}>
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
            autoComplete="nickname"
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
            <span>
              Akceptuję{" "}
              <Link
                to={"/statute"}
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Regulamin i Politykę Prywatności
              </Link>
              .
            </span>
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
