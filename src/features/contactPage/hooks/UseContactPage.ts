import { useCallback, useState, type FormEvent } from "react"
import { ContactService } from "@/shared/api/services/ContactService"

const useContactPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const resetForm = useCallback(() => {
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
  }, [])

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (busy) return

      setError(null)

      if (!name.trim()) return setError("Podaj imię i nazwisko.")
      if (name.trim().length < 2)
        return setError("Imię musi mieć przynajmniej 2 znaki.")

      if (!email.trim()) return setError("Podaj email.")
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
        return setError("Nieprawidłowy adres email.")

      if (!subject.trim()) return setError("Podaj temat.")
      if (subject.trim().length < 3)
        return setError("Temat musi mieć przynajmniej 3 znaki.")

      if (!message.trim()) return setError("Podaj treść wiadomości.")
      if (message.trim().length < 20)
        return setError("Wiadomość musi mieć przynajmniej 20 znaków.")

      setBusy(true)

      try {
        const res = await ContactService.sendMessage({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        })

        if (!res.isSuccess) {
          setError(res.message || "Spróbuj ponownie za chwilę.")
          return
        }

        resetForm()
        setIsSuccessModalOpen(true)
      } catch {
        setError("Spróbuj ponownie za chwilę.")
      } finally {
        setBusy(false)
      }
    },
    [busy, email, message, name, resetForm, subject]
  )

  return {
    name,
    setName,
    email,
    setEmail,
    subject,
    setSubject,
    message,
    setMessage,
    busy,
    error,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    submit,
  }
}

export default useContactPage
