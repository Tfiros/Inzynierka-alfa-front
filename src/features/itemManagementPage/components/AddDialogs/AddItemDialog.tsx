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

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void

  gameId: number | null
  onGameChange: (v: number) => void

  gamesOpen: boolean
  onGamesOpenChange: (v: boolean) => void

  gameSearch: string
  onGameSearchChange: (v: string) => void

  games: DropdownOption[]

  name: string
  onNameChange: (v: string) => void

  token: string
  onTokenChange: (v: string) => void

  rarityId: number | null
  onRarityChange: (v: number) => void

  raritiesOpen: boolean
  onRaritiesOpenChange: (v: boolean) => void

  raritySearch: string
  onRaritySearchChange: (v: string) => void

  rarities: DropdownOption[]

  image: File | null
  onImageChange: (file: File | null) => void

  saving: boolean
  canSubmit: boolean
  onSubmit: () => void
}

const AddItemDialog = (p: Props) => {
  return (
    <Dialog open={p.open} onOpenChange={p.onOpenChange}>
      <DialogContent className="rounded-2xl border bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Dodaj itemek</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm opacity-70">Gra</div>
            <Select
              value={String(p.gameId ?? "")}
              onValueChange={(v) => p.onGameChange(Number(v))}
              open={p.gamesOpen}
              onOpenChange={p.onGamesOpenChange}
            >
              <div className="rounded-md border bg-background text-foreground">
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz grę..." />
                </SelectTrigger>
              </div>

              <SelectContent className="border bg-background text-foreground">
                <div className="p-2">
                  <Input
                    value={p.gameSearch}
                    onChange={(e) => p.onGameSearchChange(e.target.value)}
                    placeholder="Szukaj gry..."
                    onKeyDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {p.games.length === 0 ? (
                  <div className="px-3 pb-2 text-sm opacity-70">
                    Brak wyników
                  </div>
                ) : (
                  p.games.map((g) => (
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
            <Input
              value={p.name}
              onChange={(e) => p.onNameChange(e.target.value)}
              placeholder="np. Legendary Sword"
              className="bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm opacity-70">Estimated token value</div>
            <Input
              value={p.token}
              onChange={(e) => p.onTokenChange(e.target.value)}
              placeholder="np. 150"
              inputMode="numeric"
              className="bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm opacity-70">Rarity</div>
            <Select
              value={String(p.rarityId ?? "")}
              onValueChange={(v) => p.onRarityChange(Number(v))}
              open={p.raritiesOpen}
              onOpenChange={p.onRaritiesOpenChange}
              disabled={!p.gameId}
            >
              <div className="rounded-md border bg-background text-foreground">
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz rarity..." />
                </SelectTrigger>
              </div>

              <SelectContent className="border bg-background text-foreground">
                <div className="p-2">
                  <Input
                    value={p.raritySearch}
                    onChange={(e) => p.onRaritySearchChange(e.target.value)}
                    placeholder="Szukaj rarity..."
                    onKeyDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {!p.gameId ? (
                  <div className="px-3 pb-2 text-sm opacity-70">
                    Najpierw wybierz grę
                  </div>
                ) : p.rarities.length === 0 ? (
                  <div className="px-3 pb-2 text-sm opacity-70">
                    Brak wyników
                  </div>
                ) : (
                  p.rarities.map((r) => (
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
              photos={p.image ? [p.image] : []}
              onChange={(fs) => p.onImageChange(fs[0] ?? null)}
              maxFiles={1}
              disabled={p.saving}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => p.onOpenChange(false)}
            disabled={p.saving}
            className={p.saving ? "" : "cursor-pointer"}
          >
            Anuluj
          </Button>

          <Button
            onClick={p.onSubmit}
            disabled={p.saving || !p.canSubmit}
            className={p.saving || !p.canSubmit ? "" : "cursor-pointer"}
          >
            Dodaj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddItemDialog
