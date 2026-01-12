import type { InTradeUser } from "@/shared/types/tradeTypes/MiddlemanTypes"
import { User, Package } from "lucide-react"

type Props = { party?: InTradeUser | null; title: string }

const PartyBlock = ({ party, title }: Props) => {
  if (!party) {
    return (
      <div className="space-y-3">
        <div className="text-xs text-muted-foreground">{title}</div>
        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          Brak danych.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground">{title}</div>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-sm font-medium">{party.nickname}</div>
          <div className="text-xs text-muted-foreground">{party.email}</div>
        </div>
      </div>

      {party.offeredItems?.length ? (
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-start gap-2">
            <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Przedmioty:</div>
              <div className="text-sm">
                {party.offeredItems.map((it, idx) => (
                  <div key={`${it.itemName}-${idx}`}>
                    {it.itemName} × {it.quantity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          Brak przedmiotów w podglądzie.
        </div>
      )}
    </div>
  )
}

export default PartyBlock
