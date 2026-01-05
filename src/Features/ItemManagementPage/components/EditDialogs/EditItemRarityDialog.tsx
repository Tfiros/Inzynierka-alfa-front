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

const EditItemRarityDialog = (props: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialName: string
  onSave: (payload: { name: string }) => Promise<void> | void
}) => {
  const [name, setName] = useState(props.initialName)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!props.open) return
    setName(props.initialName)
  }, [props.open, props.initialName])

  const submit = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    setSaving(true)
    try {
      await props.onSave({ name: trimmed })
      props.onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edytuj rzadkość</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="text-sm opacity-70">Nazwa</div>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => props.onOpenChange(false)}
            disabled={saving}
          >
            Anuluj
          </Button>
          <Button onClick={submit} disabled={saving || !name.trim()}>
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditItemRarityDialog
