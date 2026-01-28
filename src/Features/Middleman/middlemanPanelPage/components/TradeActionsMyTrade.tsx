import { Button } from "@/shared/components/button"
import { List } from "lucide-react"

type Props = {
  tokenCost: number
  onDetails: () => void
}

const TradeActionsMyTrade = ({ tokenCost, onDetails }: Props) => {
  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Koszt tokenów:</span>
        <span className="text-foreground">{tokenCost}</span>
      </div>

      <Button
        variant="outline"
        className="mt-3 w-full gap-2"
        onClick={onDetails}
      >
        <List className="h-4 w-4" />
        Szczegóły
      </Button>
    </div>
  )
}

export default TradeActionsMyTrade
