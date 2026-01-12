import { UploadCloud, X } from "lucide-react"
import { cn } from "@/shared/lib/Utils"
import { Button } from "@/shared/components/button"
import { usePhotosDropzone } from "../hooks/UsePhotosDropzone"

type Props = {
  maxFiles?: number
  disabled?: boolean
}

const PhotosDropzone = ({ maxFiles = 5, disabled }: Props) => {
  const { previews, isOver, remaining, actions, handlers } = usePhotosDropzone({
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
          Przeciągnij zdjęcia tutaj (max {maxFiles})
        </div>
        <div className="text-xs text-muted-foreground">
          Na razie to tylko UI — nie wysyłamy jeszcze na backend.
        </div>

        <div className="mt-2">
          <label className={cn(disabled && "pointer-events-none")}>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlers.onInputChange}
            />
            <Button
              type="button"
              variant="outline"
              disabled={disabled || remaining <= 0}
            >
              Wybierz pliki
            </Button>
          </label>
        </div>
      </div>

      {previews.length ? (
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
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">
          Nie dodano jeszcze żadnych plików.
        </div>
      )}
    </div>
  )
}

export default PhotosDropzone
