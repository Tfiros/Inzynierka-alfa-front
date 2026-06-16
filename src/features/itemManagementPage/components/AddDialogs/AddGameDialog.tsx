import { useEffect, useMemo, useState } from "react"
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
import PhotosDropzone from "@/shared/components/PhotosDropzone"

type AddGamePayload = {
  name: string
  genreId: number
  itemRaritiesNames: string[]
  image: File | null
}

const AddGameDialog = (props: {
  open: boolean
  onOpenChange: (v: boolean) => void
  genres: DropdownOption[]
  initialGenreId?: number | null
  onSave: (payload: AddGamePayload) => Promise<void> | void
}) => {
  const [name, setName] = useState("")
  const [genreId, setGenreId] = useState<number | null>(
    props.initialGenreId ?? null
  )
  const [saving, setSaving] = useState(false)

  const [rarityInput, setRarityInput] = useState("")
  const [rarities, setRarities] = useState<string[]>([])
  const [image, setImage] = useState<File | null>(null)

  useEffect(() => {
    if (!props.open) return
    setName("")
    setGenreId(props.initialGenreId ?? props.genres[0]?.id ?? null)

    setRarityInput("")
    setRarities([])
    setImage(null)
  }, [props.open, props.initialGenreId, props.genres])

  const normalizedRarities = useMemo(
    () => rarities.map((r) => r.trim()).filter(Boolean),
    [rarities]
  )

  const addRarity = () => {
    const value = rarityInput.trim()
    if (!value) return

    const exists = rarities.some((r) => r.toLowerCase() === value.toLowerCase())
    if (exists) return

    setRarities((prev) => [...prev, value])
    setRarityInput("")
  }

  const removeRarity = (value: string) => {
    setRarities((prev) => prev.filter((r) => r !== value))
  }

  const submit = async () => {
    const trimmed = name.trim()
    if (!trimmed || !genreId) return

    setSaving(true)
    try {
      await props.onSave({
        name: trimmed,
        genreId,
        itemRaritiesNames: normalizedRarities,
        image,
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
          <DialogTitle>Dodaj grę</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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

          <div className="space-y-2">
            <div className="text-sm opacity-70">Item rarities</div>

            <div className="flex gap-2">
              <Input
                value={rarityInput}
                onChange={(e) => setRarityInput(e.target.value)}
                placeholder="np. Common / Rare / Epic"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addRarity()
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={addRarity}
                disabled={saving || !rarityInput.trim()}
                className={
                  saving || !rarityInput.trim() ? "" : "cursor-pointer"
                }
              >
                Dodaj
              </Button>
            </div>

            {rarities.length > 0 ? (
              <div className="space-y-2 rounded-xl border p-3">
                <div className="text-xs opacity-60">
                  Dodane ({rarities.length})
                </div>

                <div className="flex flex-wrap gap-2">
                  {rarities.map((r) => (
                    <div
                      key={r}
                      className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
                    >
                      <span>{r}</span>
                      <button
                        type="button"
                        className="opacity-60 hover:opacity-100 cursor-pointer"
                        onClick={() => removeRarity(r)}
                        aria-label={`Usuń rarity ${r}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs opacity-60">
                Dodaj przynajmniej jedną rarity.
              </div>
            )}
            <div className="space-y-2">
              <div className="text-sm opacity-70">Zdjęcie</div>
              <PhotosDropzone
                photos={image ? [image] : []}
                onChange={(fs) => setImage(fs[0] ?? null)}
                maxFiles={1}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => props.onOpenChange(false)}
            disabled={saving}
            className={saving ? "" : "cursor-pointer"}
          >
            Anuluj
          </Button>

          <Button
            onClick={submit}
            disabled={saving || !name.trim() || !genreId}
            className={
              saving || !name.trim() || !genreId ? "" : "cursor-pointer"
            }
          >
            Dodaj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddGameDialog
