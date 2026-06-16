import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/dialog"
import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
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
          <Button
            variant="outline"
            onClick={() => props.onOpenChange(false)}
            className="cursor-pointer"
          >
            Anuluj
          </Button>
          <Button onClick={() => props.onSave(name)} className="cursor-pointer">
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default EditGenreDialog
