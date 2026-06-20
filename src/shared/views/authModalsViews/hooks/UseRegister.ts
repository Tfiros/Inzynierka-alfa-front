import { useCallback, useState, type FormEvent } from "react"
import { AuthService } from "@/shared/api/services/AuthService"
import type { AuthModalView } from "@/shared/utilities/Auth/ModalTypes"

export const useRegister = (onSwitch: (view: AuthModalView) => void) => {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [birthDate, setBirthDate] = useState<Date>()
  const [checked, setChecked] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [okMsg, setOkMsg] = useState<string | null>(null)

  const validatePassword = useCallback((password: string, confirm: string) => {
    if (password.length < 8) return false
    if (password !== confirm) return false

    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasDigit = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)

    const typesCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(
      Boolean
    ).length

    return typesCount >= 3
  }, [])

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (busy) return

      setError(null)
      setOkMsg(null)

      if (!email.trim()) return setError("Podaj email.")
      if (!password) return setError("Podaj hasło.")
      if (!validatePassword(password, confirm))
        return setError(
          "Hasło musi mieć co najmniej 8 znaków i zawierać przynajmniej trzy z następujących: małą literę, dużą literę, cyfrę, znak specjalny. Hasło musi być zgodne z potwierdzeniem."
        )
      if (!birthDate) {
        return setError("Podaj datę urodzenia")
      }
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
        setTimeout(() => onSwitch("register-confirm-email"), 500)
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
    },
    [
      busy,
      birthDate,
      checked,
      confirm,
      email,
      onSwitch,
      password,
      validatePassword,
    ]
  )

  return {
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
  }
}

export default useRegister
