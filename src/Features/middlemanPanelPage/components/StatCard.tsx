import type { ReactNode } from "react"
import { Card, CardContent } from "@/shared/components/card"

type Props = {
  title: string
  value: ReactNode
  icon: ReactNode
}

const StatCard = ({ title, value, icon }: Props) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">{title}</div>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        <div className="mt-2 text-3xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}
export default StatCard
