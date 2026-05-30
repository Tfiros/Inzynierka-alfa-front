import { cn } from "@/shared/lib/utils"

type AccentRingProps = {
  accent?: "blue" | "green"
}

const AccentRing = ({ accent }: AccentRingProps) => {
  if (!accent) return null
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-offset-2 ring-offset-background",
        accent === "blue" ? "ring-blue-400/60" : "ring-emerald-400/60"
      )}
    />
  )
}

export default AccentRing
