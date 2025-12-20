import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { DropdownOption } from "@/shared/types/itemManagementTypes/DropdownTypes"

const EditItemDialog = (props: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialName: string
  initialGameId: number
  games: DropdownOption[]
  onSave: (payload: { name?: string; gameId?: number }) => Promise<void>
}) => {
  const [name, setName] = useState(props.initialName)
  const [gameId, setGameId] = useState<number>(props.initialGameId)

  useEffect(() => {
    if (props.open) {
      setName(props.initialName)
      setGameId(props.initialGameId)
    }
  }, [props.open, props.initialName, props.initialGameId])

  const gameValue = useMemo(() => String(gameId || ""), [gameId])

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edytuj itemek</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm opacity-70">Nazwa</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <div className="text-sm opacity-70">Gra</div>
            <Select
              value={gameValue}
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
          <Button variant="outline" onClick={() => props.onOpenChange(false)}>
            Anuluj
          </Button>
          <Button onClick={() => props.onSave({ name, gameId })}>Zapisz</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default EditItemDialog
