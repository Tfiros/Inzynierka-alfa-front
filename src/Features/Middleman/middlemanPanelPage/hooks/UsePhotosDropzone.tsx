import { useCallback, useEffect, useMemo, useState } from "react"

type UsePhotosDropzoneArgs = {
  maxFiles: number
  disabled?: boolean
}

export const usePhotosDropzone = ({
  maxFiles,
  disabled,
}: UsePhotosDropzoneArgs) => {
  const [files, setFiles] = useState<File[]>([])
  const [isOver, setIsOver] = useState(false)

  const remaining = maxFiles - files.length

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      if (disabled) return

      const arr = Array.from(incoming).filter((f) =>
        f.type.toLowerCase().startsWith("image/")
      )
      if (!arr.length) return

      setFiles((prev) => {
        if (prev.length >= maxFiles) return prev
        const next = [...prev]
        for (const f of arr) {
          if (next.length >= maxFiles) break
          next.push(f)
        }
        return next
      })
    },
    [disabled, maxFiles]
  )

  const removeAt = useCallback((idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }, [])

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
    return files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
  }, [files])

  useEffect(() => {
    return () => {
      for (const p of previews) URL.revokeObjectURL(p.url)
    }
  }, [previews])

  return {
    files,
    previews,
    isOver,
    remaining,
    actions: { addFiles, removeAt, setFiles },
    handlers: { onDrop, onDragOver, onDragLeave, onInputChange },
  }
}
