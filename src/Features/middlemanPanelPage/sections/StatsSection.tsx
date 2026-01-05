import type { MiddlemanStatsDto } from "@/shared/types/middlemanTypes/MiddlemanTypes"
import StatCard from "../components/StatCard"
import { CheckCircle2, Layers, UserCheck, Sparkles } from "lucide-react"
import { Skeleton } from "@/shared/components/Skeleton"

type Props = {
  loading: boolean
  stats: MiddlemanStatsDto | null
}

const StatsSection = ({ loading, stats }: Props) => {
  const val = (n: number) => (loading ? <Skeleton className="h-9 w-16" /> : n)

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Wszystkie"
        value={val(stats?.total ?? 0)}
        icon={<Layers className="h-4 w-4" />}
      />
      <StatCard
        title="Zakończone"
        value={val(stats?.finished ?? 0)}
        icon={<CheckCircle2 className="h-4 w-4" />}
      />
      <StatCard
        title="Moje aktywne"
        value={val(stats?.mineActive ?? 0)}
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
