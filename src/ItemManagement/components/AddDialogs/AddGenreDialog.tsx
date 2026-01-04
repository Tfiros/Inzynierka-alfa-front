import { useEffect, useState } from "react"
import { Button } from "@/componentsShared/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const AddGenreDialog = (props: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSave: (payload: { name: string }) => Promise<void> | void
}) => {
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (props.open) setName("")
  }, [props.open])

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
          <DialogTitle>Dodaj gatunek</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="text-sm opacity-70">Nazwa</div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="np. RPG"
          />
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
            Dodaj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default AddGenreDialog
