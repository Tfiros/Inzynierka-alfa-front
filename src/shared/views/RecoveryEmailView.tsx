import { useState } from "react"

import { Button } from "@/shared/components/Button"
import { Input } from "@/shared/components/Input"
import type { ModalViewPropsTypes } from "../utilities/Auth/ModalTypes"
import { Label } from "../components/Label"
import { AuthService } from "../api/services/AuthService"

const RecoveryEmailView = ({ onSwitch }: ModalViewPropsTypes) => {
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [okMsg, setOkMsg] = useState<string | null>(null)

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return

    setError(null)
    setOkMsg(null)

    if (!email.trim()) {
      setError("Podaj adres email.")
      return
    }

    try {
      setBusy(true)
      const res = await AuthService.forgotPassword({ email })

      setOkMsg(
        res?.message ??
          "Jeśli podany email istnieje w systemie, wysłaliśmy instrukcje resetu hasła."
      )
      setTimeout(() => onSwitch("forgot-success"), 800)
    } catch (err: any) {
      const msg =
        err?.message ??
        err?.details?.error_description ??
        err?.details?.error ??
        "Nie udało się wysłać maila resetującego hasło."
      setError(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <form className="gap-y-4 flex flex-col mt-4" onSubmit={submitHandler}>
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
          {busy ? "Wysyłanie…" : "Odzyskaj hasło"}
        </Button>
      </form>
    </>
  )
}

export default RecoveryEmailView
