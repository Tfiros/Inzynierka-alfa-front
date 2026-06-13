import type {
  MiddlemanTab,
  TradeListItem,
} from "@/shared/types/tradeTypes/MiddlemanTypes"
import { Card, CardContent } from "@/shared/components/card"
import { ArrowLeftRight, MessageCircle } from "lucide-react"
import { formatDateTimePl } from "../utils/dateUtils"
import PartyBlock from "./PartyBlock"
import TradeActionsMyTrade from "./TradeActionsMyTrade"
import TradeStatusPill from "./TradeStatusPill"
import TradeActionsAvailable from "./TradesActionsAvailable"
import useTradeChats from "../hooks/UseTradeChats"
import { Button } from "@/shared/components/button"
import { useAppStore } from "@/shared/store/appStore"
import React, { memo } from "react"

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
  const currentUserId = useAppStore((s) => s.userId)
  const isInTrade =
    currentUserId === trade.customer.userId ||
    currentUserId === trade.postingUser.userId

  const canUseMiddlemanActions = isMiddleman && !isInTrade
  const hasMiddleman = trade.middlemanUserId != null
  const { isLoadingChats, openBuyerChat, openSellerChat, openMyChat } =
    useTradeChats({
      tradeId: trade.tradeId,
      hasMiddleman,
      isMiddleman: canUseMiddlemanActions,
      buyerUserId: trade.customer.userId,
      sellerUserId: trade.postingUser.userId,
    })

  return (
    <Card className="shadow-sm" data-trade-id={trade.tradeId}>
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
          <PartyBlock
            title="Odbierający"
            party={trade.customer}
            tokens={trade.tokensWanted}
          />

          <div className="hidden justify-center lg:flex">
            <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <PartyBlock
            title="Wystawiający"
            party={trade.postingUser}
            tokens={trade.tokensOffered}
          />
        </div>

        {tab === "available" && canUseMiddlemanActions ? (
          <TradeActionsAvailable
            tokenCost={trade.creationCost}
            onAssign={onAssign}
          />
        ) : (tab === "mine" || tab == "failedReturns") &&
          canUseMiddlemanActions ? (
          <TradeActionsMyTrade
            tab={tab}
            tokenCost={trade.creationCost}
            onDetails={onDetails}
            onCanceleTrade={onCancleTrade}
            onCompleteClick={onCompleteClick}
          />
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
          {canUseMiddlemanActions ? (
            <>
              <Button
                variant="outline"
                className="gap-2 cursor-pointer"
                disabled={!hasMiddleman || isLoadingChats}
                onClick={() => void openBuyerChat()}
              >
                <MessageCircle className="h-4 w-4" />
                Czat z odbiorcą
              </Button>
              <Button
                variant="outline"
                className="gap-2 cursor-pointer"
                disabled={!hasMiddleman || isLoadingChats}
                onClick={() => void openSellerChat()}
              >
                <MessageCircle className="h-4 w-4" />
                Czat z wystawiającym
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              className="gap-2 cursor-pointer"
              disabled={!hasMiddleman || isLoadingChats}
              onClick={() => void openMyChat()}
            >
              <MessageCircle className="h-4 w-4" />
              Otwórz czat z pośrednikiem
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const areEqual = (p: Props, n: Props) => {
  return (
    p.tab === n.tab &&
    p.isMiddleman === n.isMiddleman &&
    p.trade.tradeId === n.trade.tradeId &&
    p.trade.tradeStatusId === n.trade.tradeStatusId &&
    p.trade.middlemanUserId === n.trade.middlemanUserId
  )
}

export default memo(TradeCard, areEqual)
