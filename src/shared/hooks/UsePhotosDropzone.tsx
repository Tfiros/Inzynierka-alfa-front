import { useCallback, useEffect, useMemo, useState } from "react"
import {
  imageValidationMessage,
  validateImageFIle,
} from "../lib/ImageValidation"

type UsePhotosDropzoneArgs = {
  photos: File[]
  onChange: (files: File[]) => void
  maxFiles: number
  disabled?: boolean
}

export const usePhotosDropzone = ({
  photos,
  onChange,
  maxFiles,
  disabled,
}: UsePhotosDropzoneArgs) => {
  const [isOver, setIsOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remaining = Math.max(0, maxFiles - photos.length)

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      if (disabled) return

      const acceptedPhotos: File[] = []
      for (const f of Array.from(incoming)) {
        const err = validateImageFIle(f)
        if (err) {
          setError(imageValidationMessage(err))
          continue
        }
        acceptedPhotos.push(f)
      }

      if (!acceptedPhotos.length) return

      const next =
        maxFiles === 1
          ? [acceptedPhotos[0]]
          : [...photos, ...acceptedPhotos].slice(0, maxFiles)

      onChange(next)
      setError(null)
    },
    [disabled, maxFiles, onChange, photos]
  )

  const removeAt = useCallback(
    (idx: number) => {
      onChange(photos.filter((_, i) => i !== idx))
    },
    [onChange, photos]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsOver(false)
      if (disabled) return
      if (remaining <= 0) return
      if (e.dataTransfer?.files) addFiles(e.dataTransfer.files)
    },
    [addFiles, disabled, remaining]
  )

  const onDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) setIsOver(true)
    },
    [disabled]
  )

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOver(false)
  }, [])

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return
      addFiles(e.target.files)
      e.target.value = ""
    },
    [addFiles]
  )

  const previews = useMemo(() => {
    return photos.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
  }, [photos])

  useEffect(() => {
    return () => {
      for (const p of previews) URL.revokeObjectURL(p.url)
    }
  }, [previews])

  return {
    previews,
    isOver,
    remaining,
    error,
    actions: { addFiles, removeAt },
    handlers: { onDrop, onDragOver, onDragLeave, onInputChange },
  }
}
