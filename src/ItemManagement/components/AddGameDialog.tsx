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

const AddGameDialog = (props: {
  open: boolean
  onOpenChange: (v: boolean) => void
  genres: DropdownOption[]
  initialGenreId?: number | null
  onSave: (payload: { name: string; genreId: number }) => Promise<void> | void
}) => {
  const [name, setName] = useState("")
  const [genreId, setGenreId] = useState<number | null>(
    props.initialGenreId ?? null
  )
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!props.open) return
    setName("")
    setGenreId(props.initialGenreId ?? props.genres[0]?.id ?? null)
  }, [props.open, props.initialGenreId, props.genres])

  const submit = async () => {
    const trimmed = name.trim()
    if (!trimmed || !genreId) return
    setSaving(true)
    try {
      await props.onSave({ name: trimmed, genreId })
      props.onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Dodaj grę</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <div className="text-sm opacity-70">Nazwa</div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="np. Witcher 3"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm opacity-70">Gatunek</div>
            <Select
              value={String(genreId ?? "")}
              onValueChange={(v) => setGenreId(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz gatunek..." />
              </SelectTrigger>
              <SelectContent>
                {props.genres.map((g) => (
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
          <Button
            onClick={submit}
            disabled={saving || !name.trim() || !genreId}
          >
            Dodaj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default AddGameDialog
