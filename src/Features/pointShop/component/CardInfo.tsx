import { Card, CardContent } from "@/shared/components/Card"
import type { ReactNode } from "react"

type CardInfoProps = {
  title: string
  subtitle?: string
  icon: ReactNode
  items: { icon: ReactNode; text: ReactNode }[]
}

export const CardInfo = ({ title, subtitle, icon, items }: CardInfoProps) => {
  return (
    <Card className="w-[300px] rounded-2xl bg-zinc-900 text-zinc-50">
      <CardContent className="p-5">
        <div className="flex gap-3">
          {icon}
          <div>
            <p className="font-semibold">{title}</p>
            {subtitle && <p className="text-sm text-zinc-300">{subtitle}</p>}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {items.map((it, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <div className="text-emerald-400">{it.icon}</div>
              <div className="text-zinc-200">{it.text}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
