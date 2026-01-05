import { Link } from "react-router-dom"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/card"
import { Button } from "@/shared/components/button"
import type { ReactNode } from "react"

export interface ActionCardProps {
  icon: ReactNode
  title: string
  description: string
  ctaLabel: string
  to: string
  className?: string
  iconBg?: string
  buttonClass?: string
}

export const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  ctaLabel,
  to,
  className = "",
  iconBg = "bg-muted",
  buttonClass = "bg-black text-white hover:bg-black/90",
}) => {
  return (
    <Card
      className={`rounded-xl border-muted-foreground/20 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      <CardHeader className="flex flex-col items-center space-y-2 text-center">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}
        >
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Button asChild className={`w-full h-11 rounded-xl ${buttonClass}`}>
          <Link to={to}>{ctaLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
