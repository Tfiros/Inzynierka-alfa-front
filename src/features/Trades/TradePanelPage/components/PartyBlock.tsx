import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip"
import type { InTradeUser } from "@/shared/types/tradeTypes/MiddlemanTypes"
import { User, Package } from "lucide-react"
import PointsIcon from "@/shared/photos/PointsIcon.svg"

type Props = { party?: InTradeUser | null; title: string; tokens?: number }

const PartyBlock = ({ party, title, tokens }: Props) => {
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
        <Avatar>
          <AvatarImage
            src={party.imageUrl ?? undefined}
            alt={party.nickname}
            className="rounded-md object-cover"
          />
          <AvatarFallback>
            <User className="h-4 w-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
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
          {tokens && tokens > 0 ? (
            <span className="inline-flex w-fit items-center gap-1 text-sm font-medium text-amber-600">
              + {tokens}
              <Tooltip>
                <TooltipTrigger asChild>
                  <img
                    src={PointsIcon}
                    alt="tokenów"
                    className="h-4 w-4 object-contain"
                  />
                </TooltipTrigger>
                <TooltipContent>tokenów</TooltipContent>
              </Tooltip>
            </span>
          ) : null}
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
