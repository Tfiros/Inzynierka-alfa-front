import type { ReactNode } from "react"
import { Card, CardContent } from "@/shared/components/Card"

type Props = {
  title: string
  value: ReactNode
  subtitle: string
  icon: ReactNode
}

const StatCard = ({ title, value, subtitle, icon }: Props) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              {title}
            </div>
            <div className="text-3xl font-semibold tracking-tight">{value}</div>
            <div className="text-xs text-muted-foreground">{subtitle}</div>
          </div>

          <div className="rounded-md border bg-muted/50 p-2 text-muted-foreground">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default StatCard
