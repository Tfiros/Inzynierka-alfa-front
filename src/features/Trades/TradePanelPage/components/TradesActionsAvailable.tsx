import { Button } from "@/shared/components/button"
import { UserPlus, X } from "lucide-react"

type Props = {
  tokenCost: number
  onAssign: () => void
  disabled?: boolean
  onCancleTrade: () => void
}

const TradeActionsAvailable = ({
  tokenCost,
  onAssign,
  disabled,
  onCancleTrade,
}: Props) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Koszt tokenów:</span>
        <span className="text-foreground">{tokenCost}</span>
      </div>

      <Button
        className="mt-3 w-full gap-2 bg-black text-white hover:bg-black/90"
        onClick={onAssign}
        disabled={disabled}
      >
        <UserPlus className="h-4 w-4" />
        Przypisz do mnie
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

export default TradeActionsAvailable
