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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentsShared/select"
import type { DropdownOption } from "@/shared/types/itemManagementTypes/DropdownTypes"
import { ItemRaritiesService } from "@/api/services/ItemRaritiesService"

type AddItemPayload = {
  name: string
  estimatedTokenValue: number
  gameId: number
  itemRarityId: number
}

const AddItemDialog = (props: {
  open: boolean
  onOpenChange: (v: boolean) => void
  games: DropdownOption[]
  initialGameId?: number | null
  onSave: (payload: AddItemPayload) => Promise<void> | void
}) => {
  const [name, setName] = useState("")
  const [estimatedTokenValue, setEstimatedTokenValue] = useState<string>("")
  const [gameId, setGameId] = useState<number | null>(
    props.initialGameId ?? null
  )

  const [rarities, setRarities] = useState<DropdownOption[]>([])
  const [rarityId, setRarityId] = useState<number | null>(null)

  const [raritiesOpen, setRaritiesOpen] = useState(false)
  const [raritySearch, setRaritySearch] = useState("")
  const [raritiesLoading, setRaritiesLoading] = useState(false)

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!props.open) return

    setName("")
    setEstimatedTokenValue("")
    setGameId(props.initialGameId ?? props.games[0]?.id ?? null)

    setRarities([])
    setRarityId(null)
    setRaritySearch("")
    setRaritiesOpen(false)
  }, [props.open, props.initialGameId, props.games])

  useEffect(() => {
    if (!props.open) return
    setRarities([])
    setRarityId(null)
    setRaritySearch("")
  }, [gameId, props.open])

  const extractDropdownItems = (res: any): DropdownOption[] => {
    const d = res?.data
    if (!d) return []
    return ((d?.items ?? d?.elements ?? d) as DropdownOption[]) ?? []
  }

  const loadRaritiesDropdown = async () => {
    if (!gameId) return
    setRaritiesLoading(true)
    try {
      const res = await ItemRaritiesService.dropdown(
        gameId,
        raritySearch.trim() || ""
      )

      if (!res?.isSuccess) {
        setRarities([])
        setRarityId(null)
        return
      }

      const list = extractDropdownItems(res)
      setRarities(list)

      if (list.length === 0) {
        setRarityId(null)
        return
      }

      if (!rarityId || !list.some((x) => x.id === rarityId)) {
        setRarityId(list[0].id)
      }
    } finally {
      setRaritiesLoading(false)
    }
  }

  useEffect(() => {
    if (!props.open) return
    if (!raritiesOpen) return
    void loadRaritiesDropdown()
  }, [raritiesOpen])

  useEffect(() => {
    if (!props.open) return
    if (!raritiesOpen) return
    const t = setTimeout(() => {
      void loadRaritiesDropdown()
    }, 250)
    return () => clearTimeout(t)
  }, [raritySearch, gameId, raritiesOpen, props.open])

  const submit = async () => {
    const trimmed = name.trim()
    if (!trimmed || !gameId || !rarityId) return

    const parsed = Number(estimatedTokenValue)
    if (!Number.isFinite(parsed) || parsed < 0) return

    setSaving(true)
    try {
      await props.onSave({
        name: trimmed,
        estimatedTokenValue: parsed,
        gameId,
        itemRarityId: rarityId,
      })
      props.onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  const isTokenOk = (() => {
    const v = estimatedTokenValue.trim()
    if (!v) return false
    const n = Number(v)
    return Number.isFinite(n) && n >= 0
  })()

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
            <div className="text-sm opacity-70">Estimated token value</div>
            <Input
              value={estimatedTokenValue}
              onChange={(e) => setEstimatedTokenValue(e.target.value)}
              placeholder="np. 150"
              inputMode="numeric"
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
                <SelectValue
                  placeholder={
                    gameId ? "Wybierz rarity..." : "Najpierw wybierz grę"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                <div className="p-2">
                  <Input
                    value={raritySearch}
                    onChange={(e) => setRaritySearch(e.target.value)}
                    placeholder="Szukaj rarity..."
                    onKeyDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    disabled={!gameId}
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
          <Button
            variant="outline"
            onClick={() => props.onOpenChange(false)}
            disabled={saving}
          >
            Anuluj
          </Button>
          <Button
            onClick={submit}
            disabled={
              saving || !name.trim() || !gameId || !rarityId || !isTokenOk
            }
          >
            Dodaj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddItemDialog
