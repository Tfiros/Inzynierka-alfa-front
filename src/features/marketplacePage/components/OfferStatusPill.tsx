import { cn } from "@/shared/lib/utils"

type Props = { offerStatusId: number }

const mapStatus = (id: number) => {
  if (id === 2) return { label: "Wygasła", cls: "bg-muted text-foreground" }
  if (id === 4) return { label: "Zakończona", cls: "bg-emerald-600 text-white" }
  if (id === 5) return { label: "Anulowana", cls: "bg-red-600 text-white" }
  return { label: `Status ${id}`, cls: "bg-muted text-foreground" }
}

const OfferStatusPill = ({ offerStatusId }: Props) => {
  const { label, cls } = mapStatus(offerStatusId)
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

export default OfferStatusPill
