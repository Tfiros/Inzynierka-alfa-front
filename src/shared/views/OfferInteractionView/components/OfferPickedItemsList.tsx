import { Button } from "@/shared/components/button"
import type { ItemOfferDto } from "@/shared/types/offerTypes/RequestResponseTypes"
import { Minus, Plus, X } from "lucide-react"

type Grouped = {
  item: ItemOfferDto
  quantity: number
}

function groupItems(items: ItemOfferDto[]): Grouped[] {
  const map = new Map<number, Grouped>()

  for (const it of items) {
    const existing = map.get(it.id)
    if (existing) {
      existing.quantity += 1
    } else {
      map.set(it.id, { item: it, quantity: 1 })
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    (a.item.name ?? "").localeCompare(b.item.name ?? "")
  )
}

type Props = {
  items: ItemOfferDto[]
  disabled: boolean
  onSetQuantity: (item: ItemOfferDto, quantity: number) => void
  onRemoveAll: (itemId: number) => void
}

const OfferPickedItemsList = ({
  items,
  disabled,
  onSetQuantity,
  onRemoveAll,
}: Props) => {
  const grouped = groupItems(items)

  if (grouped.length === 0) return null

  return (
    <div className="mt-3 flex flex-col gap-2">
      {grouped.map(({ item, quantity }) => {
        return (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-2xl border bg-white px-3 py-2 shadow-sm"
          >
            <div className="h-10 w-10 overflow-hidden rounded-xl bg-muted/30 shrink-0">
              <img
                src={item.photo_URL}
                alt={item.name}
                className="h-12 w-12 object-cover border"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{item.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {item.game.name}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 w-9 rounded-xl p-0"
                disabled={disabled || quantity <= 1}
                onClick={() => onSetQuantity(item, quantity - 1)}
                aria-label="Zmniejsz ilość"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="w-8 text-center font-semibold tabular-nums">
                {quantity}
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-9 w-9 rounded-xl p-0"
                disabled={disabled}
                onClick={() => onSetQuantity(item, quantity + 1)}
                aria-label="Zwiększ ilość"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-9 w-9 rounded-xl p-0"
                disabled={disabled}
                onClick={() => onRemoveAll(item.id)}
                aria-label="Usuń wszystkie"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OfferPickedItemsList
