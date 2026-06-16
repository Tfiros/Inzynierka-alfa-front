import { Button } from "@/shared/components/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/dialog"
import PhotosDropzone from "@/shared/components/PhotosDropzone"
import { useEffect, useState } from "react"

type Props = {
  open: boolean
  saving: boolean
  error?: string | null
  onOpenChange: (open: boolean) => void
  onSubmit: (file: File) => Promise<void>
}

const AvatarChangeDialog = ({
  open,
  saving,
  error,
  onOpenChange,
  onSubmit,
}: Props) => {
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (!open) {
      setFile(null)
    }
  }, [open])

  const handleSubmit = async () => {
    if (!file) {
      return
    }
    await onSubmit(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Zmień avatar</DialogTitle>
        </DialogHeader>
        <PhotosDropzone
          photos={file ? [file] : []}
          onChange={(fs) => setFile(fs[0] ?? null)}
          maxFiles={1}
          disabled={saving}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className={saving ? "" : "cursor-pointer"}
          >
            Anuluj
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!file || saving}
            className={!file || saving ? "" : "cursor-pointer"}
          >
            {saving ? "Zapisywanie..." : "Zapisz"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AvatarChangeDialog
