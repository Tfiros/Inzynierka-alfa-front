import { toast } from "sonner"

export const extractErrorMessage = (
  error: unknown,
  fallback = "unknown"
): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  if (error && typeof error === "object") {
    const err = error as {
      message?: string
      details?: {
        text?: string
      }
    }
    if (err.message) {
      return err.message
    }
    if (err.details?.text) {
      return err.details.text
    }
  }
  return fallback
}

export const handleError = (error: unknown, fallback: string) => {
  toast.error(extractErrorMessage(error, fallback))
}
