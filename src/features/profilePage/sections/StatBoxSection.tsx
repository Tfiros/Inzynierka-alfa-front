import { Layers, Trophy, Star, Percent } from "lucide-react"
import { formatSuccessRating } from "@/shared/lib/formatters"
import StatCard from "@/shared/components/StatCard"

export type StatBoxSectionProps = {
  activeOffers: number
  successfulTrades: number
  avgRating: number
  successRatePct: number
}

const StatBoxSection = ({ stats }: { stats: StatBoxSectionProps }) => {
  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <StatCard
          title={"Aktywne oferty"}
          value={stats.activeOffers}
          icon={<Layers className="h-5 w-5" />}
          iconVariant={"plain"}
          size={"sm"}
        />
        <StatCard
          title={"Udane wymiany"}
          value={stats.successfulTrades}
          icon={<Trophy className="h-5 w-5" />}
          iconVariant={"plain"}
          size={"sm"}
        />
        <StatCard
          title={"Średnia ocen"}
          value={stats.successfulTrades}
          icon={<Star className="h-5 w-5" />}
          iconVariant={"plain"}
          size={"sm"}
        />
        <StatCard
          title={"Sukces wymian"}
          value={formatSuccessRating(stats.successRatePct)}
          icon={<Percent className="h-5 w-5" />}
          iconVariant={"plain"}
          size={"sm"}
        />
      </div>
    </section>
  )
}

export default StatBoxSection
