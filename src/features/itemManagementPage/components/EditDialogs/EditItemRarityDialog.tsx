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

type EditItemRarityDialogProps = {
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
}

const EditItemRarityDialog = ({
  open,
  onOpenChange,
  initialName,
  initialGameId,
  gameId,
  onGameChange,
  gamesOpen,
  onGamesOpenChange,
  gameSearch,
  onGameSearchChange,
  games,
  onSave,
}: EditItemRarityDialogProps) => {
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return

    setName(initialName)
    onGameChange(initialGameId)
  }, [open, initialName, initialGameId, onGameChange])

  const submit = async () => {
    const trimmed = name.trim()
    if (!trimmed || !gameId) return

    setSaving(true)
    try {
      await onSave({
        name: trimmed,
        gameId: gameId,
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
            <div className="text-sm opacity-70">Gra</div>

            <Select
              value={gameId ? String(gameId) : undefined}
              onValueChange={(v) => onGameChange(Number(v))}
              open={gamesOpen}
              onOpenChange={onGamesOpenChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz grę..." />
              </SelectTrigger>

              <SelectContent>
                <div className="p-2">
                  <Input
                    value={gameSearch}
                    onChange={(e) => onGameSearchChange(e.target.value)}
                    placeholder="Szukaj gry..."
                    onKeyDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                  />
                </div>

                {games.length === 0 ? (
                  <div className="px-3 pb-2 text-sm opacity-70">
                    Brak wyników
                  </div>
                ) : (
                  games.map((g) => (
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
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className={saving ? "" : "cursor-pointer"}
          >
            Anuluj
          </Button>

          <Button
            onClick={submit}
            disabled={saving || !name.trim() || !gameId}
            className={
              saving || !name.trim() || !gameId ? "" : "cursor-pointer"
            }
          >
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditItemRarityDialog
