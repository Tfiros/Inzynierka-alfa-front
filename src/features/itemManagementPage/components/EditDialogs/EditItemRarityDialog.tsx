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
import type { DropdownOption } from "@/shared/types/itemManagementTypes/DropdownTypes"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/select"

const EditItemRarityDialog = (props: {
  open: boolean
  onOpenChange: (v: boolean) => void

  initialName: string
  initialGameId: number | null

  gameId: number | null
  onGameChange: (v: number | null) => void

  gamesOpen: boolean
  onGamesOpenChange: (v: boolean) => void

  gameSearch: string
  onGameSearchChange: (v: string) => void

  games: DropdownOption[]

  onSave: (payload: { name: string; gameId: number }) => Promise<void> | void
}) => {
  const [name, setName] = useState(props.initialName)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!props.open) return

    setName(props.initialName)
    props.onGameChange(props.initialGameId)
  }, [props.open, props.initialName, props.initialGameId])

  const submit = async () => {
    const trimmed = name.trim()
    if (!trimmed || !props.gameId) return

    setSaving(true)
    try {
      await props.onSave({
        name: trimmed,
        gameId: props.gameId,
      })
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

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm opacity-70">Gra</div>

            <Select
              value={props.gameId ? String(props.gameId) : undefined}
              onValueChange={(v) => props.onGameChange(Number(v))}
              open={props.gamesOpen}
              onOpenChange={props.onGamesOpenChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz grę..." />
              </SelectTrigger>

              <SelectContent>
                <div className="p-2">
                  <Input
                    value={props.gameSearch}
                    onChange={(e) => props.onGameSearchChange(e.target.value)}
                    placeholder="Szukaj gry..."
                    onKeyDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                  />
                </div>

                {props.games.length === 0 ? (
                  <div className="px-3 pb-2 text-sm opacity-70">
                    Brak wyników
                  </div>
                ) : (
                  props.games.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="text-sm opacity-70">Nazwa</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
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
          <Button
            onClick={submit}
            disabled={saving || !name.trim() || !props.gameId}
          >
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditItemRarityDialog
