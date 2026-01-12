import type { TradeListItem } from "@/shared/types/tradeTypes/MiddlemanTypes"
import type { MiddlemanTab } from "@/shared/types/tradeTypes/MiddlemanTypes"
import { Card, CardContent } from "@/shared/components/card"
import { ArrowLeftRight } from "lucide-react"
import PartyBlock from "./PartyBlock"
import TradeStatusPill from "./TradeStatusPill"
import TradeActionsAvailable from "./TradesActionsAvailable"
import TradeActionsMyTrade from "./TradeActionsMyTrade"

type Props = {
  tab: MiddlemanTab
  trade: TradeListItem
  onAssign: () => void
  onDetails: () => void
}

const formatCreated = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

const TradeCard = ({ tab, trade, onAssign, onDetails }: Props) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">
              Trade #{trade.tradeId} • Offer #{trade.offerId}
            </div>
            <div className="text-xs text-muted-foreground">
              Utworzono: {formatCreated(trade.creationDate)}
            </div>
          </div>

          <TradeStatusPill tradeStatusId={trade.tradeStatusId} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_60px_1fr] lg:items-center">
          <PartyBlock title="Klient" party={trade.customer} />

          <div className="hidden justify-center lg:flex">
            <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <PartyBlock title="Wystawiający" party={trade.postingUser} />
        </div>

        {tab === "available" ? (
          <TradeActionsAvailable
            tokenCost={trade.tokenCost}
            onAssign={onAssign}
          />
        ) : (
          <TradeActionsMyTrade
            tokenCost={trade.tokenCost}
            onDetails={onDetails}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default TradeCard
