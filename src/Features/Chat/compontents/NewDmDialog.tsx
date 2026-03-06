import { useState } from "react"
import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/dialog"
import useCreateDmChat from "../hooks/UseCreateDmChat"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
}

const NewDmDialog = ({ open, onOpenChange }: Props) => {
  const [otherUserIdText, setOtherUserIdText] = useState("")
  const { createDm, loading, error, clearError } = useCreateDmChat()

  const submit = async () => {
    const id = Number(otherUserIdText.trim())
    if (Number.isNaN(id) || id <= 0) return
    await createDm(id)
    onOpenChange(false)
    setOtherUserIdText("")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) clearError()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nowa wiadomość (DM)</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Na razie wpisz ID użytkownika (potem podmienimy na wyszukiwarkę).
          </div>

          <Input
            value={otherUserIdText}
            onChange={(e) => setOtherUserIdText(e.target.value)}
            placeholder="np. 123"
            inputMode="numeric"
          />

          {error && <div className="text-sm text-destructive">{error}</div>}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Anuluj
          </Button>
          <Button onClick={submit} disabled={loading}>
            Utwórz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewDmDialog
