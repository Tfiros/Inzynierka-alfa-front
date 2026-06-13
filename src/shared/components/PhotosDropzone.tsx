import { UploadCloud, X } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/components/button"
import { usePhotosDropzone } from "../hooks/UsePhotosDropzone"
import { Input } from "@/shared/components/input"
import { IMAGE_ACCEPT_ATTR } from "../lib/ImageValidation"

type Props = {
  photos: File[]
  onChange: (files: File[]) => void
  maxFiles?: number
  disabled?: boolean
  title?: string
}

const PhotosDropzone = ({
  photos,
  onChange,
  maxFiles = 5,
  disabled,
  title,
}: Props) => {
  const { previews, isOver, remaining, error, actions, handlers } =
    usePhotosDropzone({
      photos,
      onChange,
      maxFiles,
      disabled,
    })

  return (
    <div className="space-y-3">
      <div
        onDragOver={handlers.onDragOver}
        onDragLeave={handlers.onDragLeave}
        onDrop={handlers.onDrop}
        className={cn(
          "rounded-xl border border-dashed p-4",
          "flex flex-col items-center justify-center gap-2 text-center",
          disabled && "opacity-60",
          isOver ? "bg-muted" : "bg-card"
        )}
      >
        <UploadCloud className="h-5 w-5 text-muted-foreground" />
        <div className="text-sm font-medium">
          {maxFiles === 1
            ? "Przeciągnij zdjęcie tutaj"
            : `Przeciągnij zdjęcia tutaj (max ${maxFiles})`}
        </div>
        {title && <div className="text-xs text-muted-foreground">{title}</div>}

        <div className="mt-2">
          <label className={cn(disabled && "pointer-events-none")}>
            <Input
              type="file"
              accept={IMAGE_ACCEPT_ATTR}
              multiple={maxFiles > 1}
              className="hidden"
              onChange={handlers.onInputChange}
            />
            <Button
              type="button"
              variant="outline"
              disabled={disabled || remaining <= 0}
              asChild
            >
              <span>{maxFiles === 1 ? "Wybierz plik" : "Wybierz pliki"}</span>
            </Button>
          </label>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {previews.map((p, idx) => (
            <div
              key={p.url}
              className="flex items-center gap-3 rounded-xl border p-2"
            >
              <img
                src={p.url}
                alt={p.file.name}
                className="h-12 w-12 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                  {p.file.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {(p.file.size / 1024).toFixed(0)} KB
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => actions.removeAt(idx)}
                className="cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  )
}

export default PhotosDropzone
