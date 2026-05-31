import { cn } from "../lib/utils"
import { Card, CardContent } from "@/shared/components/card"

type StatCardProps = {
  title: string
  value: React.ReactNode
  icon: React.ReactNode
  subtitle?: string
  iconVariant?: "plain" | "badge"
  size?: "sm" | "md"
}

const StatCard = ({
  title,
  value,
  icon,
  subtitle,
  iconVariant,
  size,
}: StatCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardContent className={cn(size === "sm" ? "p-4" : "p-6")}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              {title}
            </div>
            <div
              className={cn(
                "font-semibold tracking-tight",
                size === "sm" ? "text-2xl" : "text-3xl"
              )}
            >
              {value}
            </div>
            <div className="text-xs text-muted-foreground">{subtitle}</div>
          </div>

          <div
            className={cn(
              iconVariant === "plain"
                ? "opacity-60"
                : "rounded-md border bg-muted/50 p-2 text-muted-foreground"
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard
