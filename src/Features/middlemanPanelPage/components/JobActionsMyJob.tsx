import { Button } from "@/shared/components/button"
import { Calendar, List, Pencil } from "lucide-react"

type Props = {
  feeCoins: number
  scheduledAt: string | null | undefined
  onDetails: () => void
  onChangeDate: () => void
  onChangeStatus: () => void
}

const formatDateTime = (iso: string | null | undefined) => {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

const JobActionsMyJob = ({
  feeCoins,
  scheduledAt,
  onDetails,
  onChangeDate,
  onChangeStatus,
}: Props) => {
  return (
    <div className="mt-6 border-t pt-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="text-xs text-muted-foreground">
          <div>Prowizja middlemana:</div>
          <div className="mt-1 text-foreground">{feeCoins} CT Coins</div>
        </div>

        <div className="text-xs text-muted-foreground sm:text-center">
          <div>Zaplanowana data:</div>
          <div className="mt-1 text-foreground">
            {formatDateTime(scheduledAt)}
          </div>
        </div>

        <div className="text-xs text-muted-foreground sm:text-right" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Button variant="outline" className="gap-2" onClick={onDetails}>
          <List className="h-4 w-4" />
          Szczegóły
        </Button>

        <Button variant="outline" className="gap-2" onClick={onChangeDate}>
          <Calendar className="h-4 w-4" />
          Zmień datę
        </Button>

        <Button variant="outline" className="gap-2" onClick={onChangeStatus}>
          <Pencil className="h-4 w-4" />
          Zmień status
        </Button>
      </div>
    </div>
  )
}
export default JobActionsMyJob
