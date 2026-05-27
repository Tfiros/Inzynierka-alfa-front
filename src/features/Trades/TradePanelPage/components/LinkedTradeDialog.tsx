import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/shared/components/dialog"
import { Skeleton } from "@/shared/components/skeleton"
import type {
  MiddlemanTab,
  TradeListItem,
} from "@/shared/types/tradeTypes/MiddlemanTypes"
import TradeCard from "./TradeCard"

type Props = {
  open: boolean
  loading: boolean
  error: string | null
  trade: TradeListItem | null
  isMiddleman: boolean
  onOpenChange: (open: boolean) => void
  onAssign: (tradeId: number) => void
  onDetails: (trade: TradeListItem) => void
  onCancelTrade: (tradeId: number) => void
  onCompleteClick: (trade: TradeListItem) => void
}

const tabByTradeStatus = (statusId: number): MiddlemanTab | null => {
  if (statusId === 1) return "available"
  if (statusId === 2) return "mine"
  if (statusId === 3) return "completed"
  if (statusId === 4) return "failedReturns"
  return null
}

const LinkedTradeDialog = ({
  open,
  loading,
  error,
  trade,
  isMiddleman,
  onOpenChange,
  onAssign,
  onDetails,
  onCancelTrade,
  onCompleteClick,
}: Props) => {
  const tab = trade ? tabByTradeStatus(trade.tradeStatusId) : null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-4rem)] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {trade ? `Wymiana #${trade?.tradeId}` : "Wymiana"}
          </DialogTitle>
        </DialogHeader>

        {loading ? <Skeleton className="h-56 w-full" /> : null}
        {error ? (
          <div className="rounded-xl border p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}
        {trade && tab ? (
          <TradeCard
            tab={tab}
            trade={trade}
            onAssign={() => onAssign(trade.tradeId)}
            onDetails={() => onDetails(trade)}
            onCancleTrade={() => onCancelTrade(trade.tradeId)}
            onCompleteClick={() => onCompleteClick(trade)}
            isMiddleman={isMiddleman}
          />
        ) : trade ? (
          <div className="rounded-xl border p-4 text-sm text-destructive">
            Nieobsługiwany status wymiany: {trade.tradeStatusId}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export default LinkedTradeDialog
