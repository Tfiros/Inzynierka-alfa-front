import type { MiddlemanTradesStats } from "@/shared/types/tradeTypes/MiddlemanTypes"
import StatCard from "../components/StatCard"
import { CheckCircle2, Layers, UserCheck, Sparkles } from "lucide-react"
import { Skeleton } from "@/shared/components/skeleton"

type Props = {
  loading: boolean
  stats: MiddlemanTradesStats | null
}

const StatsSection = ({ loading, stats }: Props) => {
  const val = (n: number) => (loading ? <Skeleton className="h-9 w-16" /> : n)

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Wszystkie"
        value={val(stats?.all ?? 0)}
        icon={<Layers className="h-4 w-4" />}
      />
      <StatCard
        title="Zakończone"
        value={val(stats?.completed ?? 0)}
        icon={<CheckCircle2 className="h-4 w-4" />}
      />
      <StatCard
        title="Moje aktywne"
        value={val(stats?.myActive ?? 0)}
        icon={<UserCheck className="h-4 w-4" />}
      />
      <StatCard
        title="Dostępne"
        value={val(stats?.available ?? 0)}
        icon={<Sparkles className="h-4 w-4" />}
      />
    </div>
  )
}

export default StatsSection
