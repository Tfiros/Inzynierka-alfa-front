import type { MiddlemanJobStatus } from "@/shared/types/middlemanTypes/MiddlemanTypes"
import { cn } from "@/shared/lib/Utils"

type Props = { status: MiddlemanJobStatus }

const JobStatusPill = ({ status }: Props) => {
  const label =
    status === "Planned"
      ? "Zaplanowana"
      : status === "InProgress"
        ? "W trakcie"
        : "Zakończona"

  const cls =
    status === "InProgress"
      ? "bg-blue-600 text-white"
      : status === "Finished"
        ? "bg-emerald-600 text-white"
        : "bg-muted text-foreground"

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
export default JobStatusPill
