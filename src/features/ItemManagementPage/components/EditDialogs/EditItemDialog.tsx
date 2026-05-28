import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/dialog"
import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/select"
import { useRaritiesDropdown } from "@/features/ItemManagementPage/hooks/UseRaritiesDropdown"
import PhotosDropzone from "@/shared/components/PhotosDropzone"

type EditItemPayload = {
  name: string
  estimatedTokenValue: number
  itemRarityId: number
  image?: File | null
}

const EditItemDialog = (props: {
  open: boolean
  onOpenChange: (v: boolean) => void

  initialName: string
  initialEstimatedTokenValue: number
  initialGameId: number
  initialRarityItemId: number

  onSave: (payload: EditItemPayload) => Promise<void>
}) => {
  const [name, setName] = useState(props.initialName)
  const [estimatedTokenValue, setEstimatedTokenValue] = useState<string>(
    String(props.initialEstimatedTokenValue ?? "")
  )

  const [rarityId, setRarityId] = useState<number | null>(
    props.initialRarityItemId
  )

  const [raritiesOpen, setRaritiesOpen] = useState(false)
  const [raritySearch, setRaritySearch] = useState("")

  const {
    rarities,
    loading: raritiesLoading,
    refresh,
  } = useRaritiesDropdown(props.initialGameId, raritySearch, raritiesOpen)
  const [image, setImage] = useState<File | null>(null)

  // rarities, raritiesLoading and refresh are provided by hook

  useEffect(() => {
    if (!props.open) return
    setName(props.initialName)
    setEstimatedTokenValue(String(props.initialEstimatedTokenValue ?? ""))
    setRarityId(props.initialRarityItemId)
    setRaritySearch("")
    setRaritiesOpen(false)
    setImage(null)
  }, [
    props.open,
    props.initialName,
    props.initialEstimatedTokenValue,
    props.initialRarityItemId,
  ])

  useEffect(() => {
    if (!props.open) return
    if (!raritiesOpen) return
    const t = setTimeout(() => {
      void refresh()
    }, 250)
    return () => clearTimeout(t)
  }, [raritySearch, raritiesOpen, props.open, refresh])

  const isTokenOk = (() => {
    const v = estimatedTokenValue.trim()
    if (!v) return false
    const n = Number(v)
    return Number.isFinite(n) && n >= 0
  })()

  const submit = async () => {
    const trimmed = name.trim()
    if (!trimmed || !rarityId || !isTokenOk) return

    await props.onSave({
      name: trimmed,
      estimatedTokenValue: Number(estimatedTokenValue),
      itemRarityId: rarityId,
      image,
    })
  }

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
            <div className="text-sm opacity-70">Estimated token value</div>
            <Input
              value={estimatedTokenValue}
              onChange={(e) => setEstimatedTokenValue(e.target.value)}
              inputMode="numeric"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm opacity-70">Rarity</div>
            <Select
              value={String(rarityId ?? "")}
              onValueChange={(v) => setRarityId(Number(v))}
              open={raritiesOpen}
              onOpenChange={setRaritiesOpen}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz rarity..." />
              </SelectTrigger>

              <SelectContent>
                <div className="p-2">
                  <Input
                    value={raritySearch}
                    onChange={(e) => setRaritySearch(e.target.value)}
                    placeholder="Szukaj rarity..."
                    onKeyDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                  />
                </div>

                {raritiesLoading ? (
                  <div className="px-3 pb-2 text-sm opacity-70">
                    Ładowanie...
                  </div>
                ) : rarities.length === 0 ? (
                  <div className="px-3 pb-2 text-sm opacity-70">
                    Brak wyników
                  </div>
                ) : (
                  rarities.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.name}
                    </SelectItem>
                  ))
                )}
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
          <Button
            onClick={submit}
            disabled={!name.trim() || !rarityId || !isTokenOk}
          >
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditItemDialog
