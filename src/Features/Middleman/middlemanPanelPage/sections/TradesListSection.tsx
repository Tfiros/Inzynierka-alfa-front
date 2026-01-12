import type { TradeListItem } from "@/shared/types/tradeTypes/MiddlemanTypes"
import type { MiddlemanTab } from "../hooks/UseMiddlemanTradesQuery"
import TradeCard from "../components/TradeCard"
import { Skeleton } from "@/shared/components/skeleton"

type Props = {
  tab: MiddlemanTab
  loading: boolean
  error: string | null
  items: TradeListItem[]

  onAssign: (tradeId: number) => void
  onDetails: (trade: TradeListItem) => void
}

const TradesListSection = ({
  tab,
  loading,
  error,
  items,
  onAssign,
  onDetails,
}: Props) => {
  if (loading) {
    return (
      <div className="mt-6 space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-3 h-4 w-72" />
            <Skeleton className="mt-6 h-24 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-6 rounded-xl border p-6 text-sm text-destructive">
        {error}
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="mt-6 rounded-xl border p-6 text-sm text-muted-foreground">
        Brak wymian do wyświetlenia.
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      {items.map((t) => (
        <TradeCard
          key={t.tradeId}
          tab={tab}
          trade={t}
          onAssign={() => onAssign(t.tradeId)}
          onDetails={() => onDetails(t)}
        />
      ))}
    </div>
  )
}

export default TradesListSection
