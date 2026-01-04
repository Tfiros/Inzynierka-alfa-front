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

import type { DropdownOption } from "@/shared/types/itemManagementTypes/DropdownTypes"
import { ItemRaritiesService } from "@/api/services/ItemRaritiesService"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/select"

type EditItemPayload = {
  name: string
  estimatedTokenValue: number
  rarityItemId: number
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

  const [rarities, setRarities] = useState<DropdownOption[]>([])
  const [rarityId, setRarityId] = useState<number | null>(
    props.initialRarityItemId
  )

  const [raritiesOpen, setRaritiesOpen] = useState(false)
  const [raritySearch, setRaritySearch] = useState("")
  const [raritiesLoading, setRaritiesLoading] = useState(false)

  const extractDropdownItems = (res: any): DropdownOption[] => {
    const d = res?.data
    if (!d) return []
    return ((d?.items ?? d?.elements ?? d) as DropdownOption[]) ?? []
  }

  const loadRaritiesDropdown = async () => {
    setRaritiesLoading(true)
    try {
      const res = await ItemRaritiesService.dropdown(
        props.initialGameId,
        raritySearch.trim() || ""
      )

      if (!res?.isSuccess) {
        setRarities([])
        return
      }

      const list = extractDropdownItems(res)
      setRarities(list)
    } finally {
      setRaritiesLoading(false)
    }
  }

  useEffect(() => {
    if (!props.open) return
    setName(props.initialName)
    setEstimatedTokenValue(String(props.initialEstimatedTokenValue ?? ""))
    setRarityId(props.initialRarityItemId)
    setRaritySearch("")
    setRarities([])
    setRaritiesOpen(false)
  }, [
    props.open,
    props.initialName,
    props.initialEstimatedTokenValue,
    props.initialRarityItemId,
  ])

  useEffect(() => {
    if (!props.open) return
    if (!raritiesOpen) return
    void loadRaritiesDropdown()
  }, [raritiesOpen, props.open])

  useEffect(() => {
    if (!props.open) return
    if (!raritiesOpen) return
    const t = setTimeout(() => {
      void loadRaritiesDropdown()
    }, 250)
    return () => clearTimeout(t)
  }, [raritySearch, raritiesOpen, props.open])

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
      rarityItemId: rarityId,
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
