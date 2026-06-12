import { useState } from "react"
import { ContactService } from "@/shared/api/services/ContactService"
import type { ContactFormData } from "@/shared/types/contactTypes"

type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>

const initialForm: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
}

const useContactPage = () => {
  const [form, setForm] = useState<ContactFormData>(initialForm)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const setField = (field: keyof ContactFormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }))
  }

  const validate = () => {
    const nextErrors: ContactFormErrors = {}

    if (form.name.trim().length === 0) {
      nextErrors.name = "Imię i nazwisko jest wymagane"
    } else if (form.name.trim().length < 2) {
      nextErrors.name = "Imię musi mieć przynajmniej 2 znaki"
    }

    if (form.email.trim().length === 0) {
      nextErrors.email = "Email jest wymagany"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
      nextErrors.email = "Nieprawidłowy adres email"
    }

    if (form.subject.trim().length === 0) {
      nextErrors.subject = "Temat jest wymagany"
    } else if (form.subject.trim().length < 3) {
      nextErrors.subject = "Temat musi mieć przynajmniej 3 znaki"
    }

    if (form.message.trim().length === 0) {
      nextErrors.message = "Wiadomość jest wymagana"
    } else if (form.message.trim().length < 20) {
      nextErrors.message = "Wiadomość musi mieć przynajmniej 20 znaków"
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const resetForm = () => {
    setForm(initialForm)
    setErrors({})
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) return

    setSubmitError(null)

    if (!validate()) return

    setIsSubmitting(true)

    try {
      const result = await ContactService.sendMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      })

      if (!result.isSuccess) {
        setSubmitError(result.message || "Spróbuj ponownie za chwilę.")
        return
      }

      resetForm()
      setIsSuccessModalOpen(true)
    } catch {
      setSubmitError("Spróbuj ponownie za chwilę.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    setField,
    errors,
    isSubmitting,
    submitError,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    onSubmit,
  }
}

export default useContactPage
