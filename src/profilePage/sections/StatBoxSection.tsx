import { Layers, Trophy, Star, Percent } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import React, { useMemo } from 'react'

const cx = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(' ')

const MOCK_STATS = {
  activeOffers: 2,
  successfulTrades: 47,
  avgRating: 4.9,
  successRatePct: 95,
}

function StatBox({
  icon,
  value,
  label,
  highlighted,
}: {
  icon: React.ReactNode
  value: React.ReactNode
  label: string
  highlighted?: boolean
}) {
  return (
    <Card className={cx('flex-1', highlighted && 'ring-2 ring-primary')}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold leading-none">{value}</div>
          <div className="opacity-60">{icon}</div>
        </div>
        <div className="mt-1 text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  )
}

export const StatBoxSection = () => {
  const stats = useMemo(() => MOCK_STATS, [])
  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <StatBox
          icon={<Layers className="h-5 w-5" />}
          value={stats.activeOffers}
          label="Aktywne oferty"
          highlighted
        />
        <StatBox
          icon={<Trophy className="h-5 w-5" />}
          value={stats.successfulTrades}
          label="Udane wymiany"
          highlighted
        />
        <StatBox
          icon={<Star className="h-5 w-5" />}
          value={stats.avgRating}
          label="Średnia ocen"
          highlighted
        />
        <StatBox
          icon={<Percent className="h-5 w-5" />}
          value={`${stats.successRatePct}%`}
          label="Sukces wymian"
          highlighted
        />
      </div>
    </section>
  )
}
