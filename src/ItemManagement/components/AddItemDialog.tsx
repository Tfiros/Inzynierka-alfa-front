import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { DropdownOption } from "@/shared/types/itemManagementTypes/DropdownTypes"

const AddItemDialog = (props: {
  open: boolean
  onOpenChange: (v: boolean) => void
  games: DropdownOption[]
  initialGameId?: number | null
  onSave: (payload: { name: string; gameId: number }) => Promise<void> | void
}) => {
  const [name, setName] = useState("")
  const [gameId, setGameId] = useState<number | null>(
    props.initialGameId ?? null
  )
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!props.open) return
    setName("")
    setGameId(props.initialGameId ?? props.games[0]?.id ?? null)
  }, [props.open, props.initialGameId, props.games])

  const submit = async () => {
    const trimmed = name.trim()
    if (!trimmed || !gameId) return
    setSaving(true)
    try {
      await props.onSave({ name: trimmed, gameId })
      props.onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Dodaj item</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <div className="text-sm opacity-70">Nazwa</div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="np. Legendary Sword"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm opacity-70">Gra</div>
            <Select
              value={String(gameId ?? "")}
              onValueChange={(v) => setGameId(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz grę..." />
              </SelectTrigger>
              <SelectContent>
                {props.games.map((g) => (
                  <SelectItem key={g.id} value={String(g.id)}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => props.onOpenChange(false)}
            disabled={saving}
          >
            Anuluj
          </Button>
          <Button onClick={submit} disabled={saving || !name.trim() || !gameId}>
            Dodaj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default AddItemDialog
