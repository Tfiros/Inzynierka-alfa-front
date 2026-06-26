import { useEffect, useState } from "react"
import { Button } from "@/shared/components/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/dialog"
import { Input } from "@/shared/components/input"

type EditItemRarityDialogProps = {
  open: boolean
  onOpenChange: (v: boolean) => void

  initialName: string

  onSave: (payload: { name: string }) => Promise<void> | void
}

const EditItemRarityDialog = ({
  open,
  onOpenChange,
  initialName,
  onSave,
}: EditItemRarityDialogProps) => {
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return

    setName(initialName)
  }, [open, initialName])

  const submit = async () => {
    const trimmed = name.trim()
    if (!trimmed) return

    setSaving(true)
    try {
      await onSave({
        name: trimmed,
      })
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edytuj rzadkość</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm opacity-70">Nazwa</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

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
            onClick={submit}
            disabled={saving || !name.trim()}
            className={saving || !name.trim() ? "" : "cursor-pointer"}
          >
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditItemRarityDialog
