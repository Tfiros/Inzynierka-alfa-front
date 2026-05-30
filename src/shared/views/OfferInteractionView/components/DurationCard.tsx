import { cn } from "@/shared/lib/utils"

const DurationCard = ({
  selected,
  title,
  subtitle,
  onClick,
}: {
  selected: boolean
  title: string
  subtitle: string
  onClick: () => void
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-4 rounded-2xl border text-left",
        "transition shadow-sm",
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-card hover:bg-muted/20 border-muted-foreground/20"
      )}
    >
      <div className={cn("text-xl font-semibold")}>{title}</div>
      <div
        className={cn(
          "text-sm mt-1",
          selected ? "text-primary-foreground/80" : "text-muted-foreground"
        )}
      >
        {subtitle}
      </div>
    </button>
  )
}

export default DurationCard
