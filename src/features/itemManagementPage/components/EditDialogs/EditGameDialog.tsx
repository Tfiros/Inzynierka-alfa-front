import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/dialog"
import { Button } from "@/shared/components/button"
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

const EditGameDialog = (props: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialName: string
  initialGenreId: number
  genres: DropdownOption[]
  onSave: (payload: {
    name?: string
    genreId?: number
    image?: File | null
  }) => Promise<void>
}) => {
  const [name, setName] = useState(props.initialName)
  const [genreId, setGenreId] = useState<number>(props.initialGenreId)
  const [image, setImage] = useState<File | null>(null)

  useEffect(() => {
    if (props.open) {
      setName(props.initialName)
      setGenreId(props.initialGenreId)
      setImage(null)
    }
  }, [props.open, props.initialName, props.initialGenreId])

  const genreValue = useMemo(() => String(genreId || ""), [genreId])

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edytuj grę</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm opacity-70">Nazwa</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <div className="text-sm opacity-70">Gatunek</div>
            <Select
              value={genreValue}
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
            <div className="space-y-2">
              <div className="text-sm opacity-70">Zdjęcie</div>
              <PhotosDropzone
                photos={image ? [image] : []}
                onChange={(fs) => setImage(fs[0] ?? null)}
                maxFiles={1}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => props.onOpenChange(false)}>
            Anuluj
          </Button>
          <Button onClick={() => props.onSave({ name, genreId, image })}>
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default EditGameDialog
