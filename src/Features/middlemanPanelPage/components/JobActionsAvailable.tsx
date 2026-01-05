import { Button } from "@/shared/components/Button"
import { UserPlus } from "lucide-react"

type Props = {
  feeCoins: number
  onAssign: () => void
  disabled?: boolean
}

const JobActionsAvailable = ({ feeCoins, onAssign, disabled }: Props) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Prowizja middlemana:</span>
        <span className="text-foreground">{feeCoins} CT Coins</span>
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
export default JobActionsAvailable
