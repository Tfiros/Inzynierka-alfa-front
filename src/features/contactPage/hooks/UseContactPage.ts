import { useState } from "react"
import { useForm } from "react-hook-form"
import { ContactService } from "@/shared/api/services/ContactService"
import type { ContactFormData } from "@/shared/types/contactTypes"

const useContactPage = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    mode: "onTouched",
  })

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
    register,
    handleSubmit,
    errors,
    isSubmitting,
    submitError,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    onSubmit,
  }
}

export default useContactPage
