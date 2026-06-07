import { toast } from "sonner"

export const handleError = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    toast.error(error.message)
    return
  }

  if (typeof error === "string") {
    toast.error(error)
    return
  }

  if (error && typeof error === "object") {
    const err = error as {
      message?: string
      details?: {
        text?: string
      }
    }

    if (err.message) {
      toast.error(err.message)
      return
    }

    if (err.details?.text) {
      toast.error(err.details.text)
      return
    }
  }

  toast.error(fallback)
}
