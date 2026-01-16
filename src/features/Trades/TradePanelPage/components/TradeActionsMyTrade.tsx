import { Button } from "@/shared/components/button"
import { List, X } from "lucide-react"

type Props = {
  tokenCost: number
  onDetails: () => void
  onCancleTrade: () => void
}

const TradeActionsMyTrade = ({
  tokenCost,
  onDetails,
  onCancleTrade,
}: Props) => {
  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Koszt tokenów:</span>
        <span className="text-foreground">{tokenCost}</span>
      </div>

      <Button
        variant="outline"
        className="mt-3 w-full gap-2 border-gray-900 hover:bg-gray-100 cursor-pointer"
        onClick={onDetails}
      >
        <List className="h-4 w-4" />
        Szczegóły
      </Button>
      <Button
        className="mt-3 w-full gap-2 bg-red-600 text-white hover:bg-red-700 cursor-pointer"
        onClick={onCancleTrade}
      >
        <X className="h-4 w-4" />
        Anuluj wymianę
      </Button>
    </div>
  )
}

export default TradeActionsMyTrade
