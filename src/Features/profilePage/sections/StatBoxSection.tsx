import { Layers, Trophy, Star, Percent } from "lucide-react"
import StatBox from "../component/StatBox"

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
          value={`${stats.successRatePct * 100}%`}
          label="Sukces wymian"
          highlighted
        />
      </div>
    </section>
  )
}

export default StatBoxSection
