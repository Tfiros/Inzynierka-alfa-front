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
import PhotosDropzone from "@/shared/components/PhotosDropzone"
import type { DropdownOption } from "@/shared/types/itemManagementTypes/DropdownTypes"
import { ItemRaritiesService } from "@/shared/api/services/ItemRaritiesService"
import useDropdownQuery from "../../hooks/UseDropdownQuery"

type EditItemPayload = {
  name: string
  estimatedTokenValue: number
  gameId: number
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

  const [gameId, setGameIdState] = useState<number | null>(props.initialGameId)

  const [rarityId, setRarityId] = useState<number | null>(
    props.initialRarityItemId
  )
  const [raritiesOpen, setRaritiesOpen] = useState(false)
  const [raritySearch, setRaritySearch] = useState("")

  const [image, setImage] = useState<File | null>(null)

  const raritiesDd = useDropdownQuery({
    enabled: !!gameId && props.open,
    open: raritiesOpen,
    search: raritySearch,
    loadOnMount: true,
    load: (q) => ItemRaritiesService.dropdown(gameId!, q),
    selectedId: rarityId,
    setSelectedId: setRarityId,
  })

  useEffect(() => {
    if (!props.open || !gameId) return

    setRarityId(null)
    setRaritySearch("")
    setRaritiesOpen(false)
    void raritiesDd.refetch()
  }, [props.open, gameId])

  useEffect(() => {
    if (!props.open) return

    setName(props.initialName)
    setEstimatedTokenValue(String(props.initialEstimatedTokenValue ?? ""))

    setGameIdState(props.initialGameId)

    setRarityId(props.initialRarityItemId)
    setRaritiesOpen(false)
    setRaritySearch("")

    setImage(null)
  }, [
    props.open,
    props.initialName,
    props.initialEstimatedTokenValue,
    props.initialGameId,
    props.initialRarityItemId,
  ])

  const isTokenOk = (() => {
    const v = estimatedTokenValue.trim()
    if (!v) return false
    const n = Number(v)
    return Number.isFinite(n) && n >= 0
  })()

  const submit = async () => {
    const trimmed = name.trim()
    if (!trimmed || !gameId || !rarityId || !isTokenOk) return

    await props.onSave({
      name: trimmed,
      estimatedTokenValue: Number(estimatedTokenValue),
      gameId,
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
              disabled={!gameId}
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

                {!gameId ? (
                  <div className="px-3 pb-2 text-sm opacity-70">
                    Najpierw wybierz grę
                  </div>
                ) : raritiesDd.loading ? (
                  <div className="px-3 pb-2 text-sm opacity-70">
                    Ładowanie...
                  </div>
                ) : raritiesDd.items.length === 0 ? (
                  <div className="px-3 pb-2 text-sm opacity-70">
                    Brak wyników
                  </div>
                ) : (
                  (raritiesDd.items as DropdownOption[]).map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="text-sm opacity-70">Zdjęcie</div>
            <PhotosDropzone
              photos={image ? [image] : []}
              onChange={(fs) => setImage(fs[0] ?? null)}
              maxFiles={1}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => props.onOpenChange(false)}
            className="cursor-pointer"
          >
            Anuluj
          </Button>
          <Button
            onClick={submit}
            disabled={!name.trim() || !gameId || !rarityId || !isTokenOk}
            className={
              !name.trim() || !gameId || !rarityId || !isTokenOk
                ? ""
                : "cursor-pointer"
            }
          >
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditItemDialog
