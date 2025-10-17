import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Box,
  RefreshCw,
  User as UserIcon,
  Bell,
  ArrowLeftRight,
} from 'lucide-react'
import type { ReactNode } from 'react'
import PointsIcon from '@/photos/PointsIcon.svg'

export default function HomeDashboard() {
  return (
    <>
      <div
        className="mx-auto max-w-5xl text-center font-extrabold leading-tight tracking-tight
                text-4xl sm:text-4xl [text-wrap:balance] mb-10"
      >
        Czysta wymiana – twoje <br /> przedmioty, twój zysk
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <ActionCard
          icon={<Box className="h-6 w-6" aria-hidden />}
          title="Dodaj przedmioty"
          description="Dodaj przedmioty, które chcesz wymienić"
          ctaLabel="Dodaj przedmiot"
          to="/items/new"
        />
        <ActionCard
          icon={<RefreshCw className="h-6 w-6" aria-hidden />}
          title="Wymieniaj się"
          description="Znajdź idealne przedmioty do wymiany"
          ctaLabel="Zobacz przedmiot"
          to="/exchange"
        />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-1">
        <ActionCard
          className="bg-black text-white border border-white/10 shadow-md"
          iconBg="bg-transparent"
          icon={<img src={PointsIcon} alt="" className="h-8 w-8" aria-hidden />}
          title="CT Coins – Waluta Premium"
          description="Kup CT Coins aby promować oferty, uzyskać dostęp premium i więcej"
          ctaLabel="Kup CT Coins"
          to="/points"
          buttonClass="bg-transparent text-white border border-white/30 hover:bg-white/10"
        />
      </div>
    </>
  )
}
function ActionCard({
  icon,
  title,
  description,
  ctaLabel,
  to,
  className = '',
  iconBg = 'bg-muted',
  buttonClass = 'bg-black text-white hover:bg-black/90',
}: {
  icon: React.ReactNode
  title: string
  description: string
  ctaLabel: string
  to: string
  className?: string
  iconBg?: string
  buttonClass?: string
}) {
  return (
    <Card
      className={`rounded-2xl border-muted-foreground/20 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      <CardHeader className="flex flex-col items-center text-center space-y-2">
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
