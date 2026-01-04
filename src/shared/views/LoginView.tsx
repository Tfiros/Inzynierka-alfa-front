import { useState } from "react"
import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
import type { ModalViewPropsTypes } from "../utilities/Auth/ModalTypes"
import PasswordInput from "../components/PasswordInput"
import { Label } from "../components/label"
import { useAppStore } from "../store/appStore"

const LoginView = ({ onSwitch }: ModalViewPropsTypes) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useAppStore((s) => s.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return

    setBusy(true)
    setError(null)

    try {
      await login(email, password)
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message ?? "Wystąpił błąd podczas logowania.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 mt-4">
        <div className="flex flex-col gap-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            autoComplete="username"
            disabled={busy}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <Label htmlFor="password">Hasło</Label>
          <PasswordInput
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            autoComplete="current-password"
            disabled={busy}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => onSwitch("forgot-email")}
            className="text-sm font-semibold cursor-pointer"
            disabled={busy}
          >
            Zapomniałeś hasła?
          </button>
        </div>

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Logowanie…" : "Zaloguj się"}
        </Button>
      </form>

      <p className="text-center text-sm mt-4">
        Nie masz konta?{" "}
        <button
          onClick={() => onSwitch("register")}
          className="text-blue-500 cursor-pointer"
          disabled={busy}
        >
          Zarejestruj się
        </button>
      </p>
    </>
  )
}

export default LoginView
