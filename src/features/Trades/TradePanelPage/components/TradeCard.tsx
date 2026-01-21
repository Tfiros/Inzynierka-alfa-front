import type {
  MiddlemanTab,
  TradeListItem,
} from "@/shared/types/tradeTypes/MiddlemanTypes"
import { Card, CardContent } from "@/shared/components/card"
import { ArrowLeftRight } from "lucide-react"
import { formatDateTimePl } from "../utils/dateUtils"
import PartyBlock from "./PartyBlock"
import TradeActionsMyTrade from "./TradeActionsMyTrade"
import TradeStatusPill from "./TradeStatusPill"
import TradeActionsAvailable from "./TradesActionsAvailable"

type Props = {
  tab: MiddlemanTab
  trade: TradeListItem
  onAssign: () => void
  onDetails: () => void
  onCancleTrade: () => void
  onCompleteClick: () => void
  isMiddleman: boolean
}

const TradeCard = ({
  tab,
  trade,
  onAssign,
  onDetails,
  onCancleTrade,
  onCompleteClick,
  isMiddleman,
}: Props) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">
              Trade #{trade.tradeId} • Offer #{trade.offerId}
            </div>
            <div className="text-xs text-muted-foreground">
              Utworzono: {formatDateTimePl(trade.creationDate)}
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

        {tab === "available" && isMiddleman ? (
          <TradeActionsAvailable
            tokenCost={trade.tokenCost}
            onAssign={onAssign}
            onCancleTrade={onCancleTrade}
          />
        ) : tab === "mine" && isMiddleman ? (
          <TradeActionsMyTrade
            tokenCost={trade.tokenCost}
            onDetails={onDetails}
            onCanceleTrade={onCancleTrade}
            onCompleteClick={onCompleteClick}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}

export default TradeCard
