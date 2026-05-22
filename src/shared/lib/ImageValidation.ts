export const ALLOWED_IMAGE_MIME = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const

export const ALLOWED_IMAGE_EXTENSION = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
] as const

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export type ImageValidationError = "type" | "size"

export const IMAGE_ACCEPT_ATTR = ALLOWED_IMAGE_EXTENSION.join(",")

export const validateImageFIle = (file: File): ImageValidationError | null => {
  const lower = file.name.toLocaleLowerCase()
  const extensionCheck = ALLOWED_IMAGE_EXTENSION.some((ext) =>
    lower.endsWith(ext)
  )
  const mimeCheck = (ALLOWED_IMAGE_MIME as readonly string[]).includes(
    file.type
  )
  if (!extensionCheck || !mimeCheck) return "type"
  if (file.size > MAX_IMAGE_BYTES) return "size"
  return null
}

export const imageValidationMessage = (err: ImageValidationError): string => {
  if (err === "type") {
    return "Dozwolone formaty: PNG, JPG, JPEG, WEBP"
  }
  return `Maksymalny rozmiar pliku to ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB`
}
