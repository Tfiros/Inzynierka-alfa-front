import { Button } from "@/shared/components/button"
import { UserPlus } from "lucide-react"

type Props = {
  tokenCost: number
  onAssign: () => void
  disabled?: boolean
}

const TradeActionsAvailable = ({ tokenCost, onAssign, disabled }: Props) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Koszt oferty:</span>
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
    </div>
  )
}

export default TradeActionsAvailable
