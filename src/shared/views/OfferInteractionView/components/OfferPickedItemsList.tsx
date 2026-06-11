import React, { memo } from "react"
import { Button } from "@/shared/components/button"
import type { ItemOfferDto } from "@/shared/types/offerTypes/RequestResponseTypes"
import { Minus, Plus, X } from "lucide-react"
import type { OfferLine } from "../utils/OfferHelpers"

type Props = {
  items: OfferLine[]
  disabled: boolean
  onSetQuantity: (item: ItemOfferDto, quantity: number) => void
  onRemoveItem: (itemId: number) => void
}

const OfferPickedItemsList = ({
  items,
  disabled,
  onSetQuantity,
  onRemoveItem: onRemoveAll,
}: Props) => {
  if (items.length === 0) return null

  return (
    <div className="mt-3 flex flex-col gap-2">
      {items.map((line) => {
        return (
          <div
            key={line.item.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2 text-card-foreground shadow-sm"
          >
            <div className="h-10 w-10 overflow-hidden rounded-xl bg-muted/30 shrink-0">
              <img
                src={line.item.photoUrl?.trim() || "/placeholder.webp"}
                alt={line.item.name}
                className="h-12 w-12 object-cover border"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.webp"
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">
                {line.item.name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {line.item.game.name}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 w-9 rounded-xl p-0"
                disabled={disabled || line.quantity <= 1}
                onClick={() => onSetQuantity(line.item, line.quantity - 1)}
                aria-label="Zmniejsz ilość"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="w-8 text-center font-semibold tabular-nums">
                {line.quantity}
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-9 w-9 rounded-xl p-0"
                disabled={disabled}
                onClick={() => onSetQuantity(line.item, line.quantity + 1)}
                aria-label="Zwiększ ilość"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-9 w-9 rounded-xl p-0"
                disabled={disabled}
                onClick={() => onRemoveAll(line.item.id)}
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

const itemsEqual = (p: Props, n: Props) => {
  if (p.disabled !== n.disabled) return false
  if (p.items.length !== n.items.length) return false
  for (let i = 0; i < p.items.length; i++) {
    const a = p.items[i]
    const b = n.items[i]
    if (a.item.id !== b.item.id || a.quantity !== b.quantity) return false
  }
  return true
}

export default memo(OfferPickedItemsList, itemsEqual)
