import { useState } from "react"
import { ContactService } from "@/shared/api/services/ContactService"

type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
}
const useContactPage = (reset: () => void) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null)

    try {
      const result = await ContactService.sendMessage(data)

      if (!result.isSuccess) {
        setSubmitError(result.message || "Spróbuj ponownie za chwilę.")
        return
      }

      reset()
      setIsSuccessModalOpen(true)
    } catch {
      setSubmitError("Spróbuj ponownie za chwilę.")
    }
  }

  return {
    submitError,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    onSubmit,
  }
}

export default useContactPage
