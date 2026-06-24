import { Button } from "@/shared/components/button"
import { UserPlus } from "lucide-react"

type Props = {
  onAssign: () => void
  disabled?: boolean
}

const TradeActionsAvailable = ({ onAssign, disabled }: Props) => {
  return (
    <div className="mt-6">
      <Button
        className={`mt-3 w-full gap-2 bg-black text-white hover:bg-black/90 ${
          disabled ? "" : "cursor-pointer"
        }`}
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
