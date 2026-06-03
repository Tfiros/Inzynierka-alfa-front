import { TradeStatus } from "@/shared/enums/TradeStatus"
import { cn } from "@/shared/lib/utils"

type Props = { tradeStatusId: number }

const mapStatus = (id: number) => {
  if (id === TradeStatus.New)
    return { label: "Nowa", cls: "bg-muted text-foreground" }
  if (id === TradeStatus.InRealization)
    return { label: "W realizacji", cls: "bg-blue-600 text-white" }
  if (id === TradeStatus.SuccesfulRealization)
    return { label: "Zakończona", cls: "bg-emerald-600 text-white" }
  if (id === TradeStatus.Failed)
    return { label: "Nieudana", cls: "bg-red-600 text-white" }
  return { label: `Status ${id}`, cls: "bg-muted text-foreground" }
}

const TradeStatusPill = ({ tradeStatusId }: Props) => {
  const { label, cls } = mapStatus(tradeStatusId)

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold",
        cls
      )}
    >
      {label}
    </span>
  )
}

export default TradeStatusPill
