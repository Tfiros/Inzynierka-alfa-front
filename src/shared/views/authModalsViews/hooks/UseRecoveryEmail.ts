import { useCallback, useState, type FormEvent } from "react"
import { AuthService } from "@/shared/api/services/AuthService"
import type { AuthModalView } from "@/shared/utilities/Auth/ModalTypes"

export const useRecoveryEmail = (onSwitch: (view: AuthModalView) => void) => {
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [okMsg, setOkMsg] = useState<string | null>(null)

  const submit = useCallback(
    async (e: FormEvent) => {
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
    },
    [busy, email, onSwitch]
  )

  return {
    email,
    setEmail,
    busy,
    error,
    okMsg,
    submit,
  }
}

export default useRecoveryEmail
