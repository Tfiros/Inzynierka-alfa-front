import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/componentsShared/button"
import { Input } from "@/components/ui/input"
const EditGenreDialog = (props: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialName: string
  onSave: (name: string) => Promise<void>
}) => {
  const [name, setName] = useState(props.initialName)

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edytuj gatunek</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="text-sm opacity-70">Nazwa</div>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => props.onOpenChange(false)}>
            Anuluj
          </Button>
          <Button onClick={() => props.onSave(name)}>Zapisz</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default EditGenreDialog
