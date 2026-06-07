import { toast } from "sonner"

export const handleError = (error: unknown, fallback: string) => {
  const errorMsg =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : fallback

  toast.error(errorMsg)
}
