import { Card, CardContent } from "@/shared/components/card"
import { Checkbox } from "@/shared/components/checkbox"
import { Badge } from "@/shared/components/badge"
import { cn } from "@/shared/lib/utils"
import { Check, Coins } from "lucide-react"
import type { PackageItem } from "@/shared/types/pointPackagesTypes/PackageItem"
import AccentRing from "./AccentRing"

type CardProps = {
  item: PackageItem
  selected: boolean
  onSelect: () => void
}

const PackageCard = ({ item, selected, onSelect }: CardProps) => {
  const total = item.coins + (item.bonus ?? 0)

  return (
    <div className="relative">
      {item.highlight && (
        <div className="absolute -top-3 left-4 z-10">
          <Badge
            className={cn(
              "rounded-full px-3 py-1 text-xs",
              item.accent === "blue" && "bg-blue-50 text-blue-700",
              item.accent === "green" && "bg-emerald-50 text-emerald-700"
            )}
          >
            {item.highlight}
          </Badge>
        </div>
      )}

      <Card
        onClick={onSelect}
        role="radio"
        aria-checked={selected}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onSelect()
          }
        }}
        className={cn(
          "relative h-full rounded-2xl border bg-card text-card-foreground shadow-sm flex flex-col cursor-pointer transition",
          "hover:border-primary/40",
          selected && "border-primary ring-2 ring-primary/20"
        )}
      >
        <CardContent className="flex flex-1 flex-col p-6">
          <div className="relative">
            <div className="absolute right-0 top-0">
              <Checkbox
                checked={selected}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "h-5 w-5 rounded-md border-2 transition-colors",
                  // tokenowo: border-input + bg-background, a dla selected primary
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background"
                )}
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{item.title}</p>
              <p className="text-xl font-semibold">{item.price}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-1 flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              <span className="text-4xl font-semibold">{item.coins}</span>
            </div>

            {item.bonus && (
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-emerald-500">
                <Check className="h-4 w-4" /> +{item.bonus} bonus
              </div>
            )}

            <p className="mt-3 text-sm text-muted-foreground">
              Razem: {total} CT Coins
            </p>
          </div>
        </CardContent>

        <AccentRing accent={item.accent} />
      </Card>
    </div>
  )
}

export default PackageCard
