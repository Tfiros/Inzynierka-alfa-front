import type { MiddlemanTab } from "@/shared/types/tradeTypes/MiddlemanTypes"
import SegmentedTabs from "../components/SegmentedTabs"

type Props = {
  value: MiddlemanTab
  onChange: (v: MiddlemanTab) => void
  availableCount: number
  mineCount: number
  completedCount: number
}

const TabsSection = ({ value, onChange }: Props) => {
  return (
    <div className="mt-6">
      <SegmentedTabs
        value={value}
        onChange={onChange}
        tabs={[
          { value: "available", label: `Dostępne` },
          { value: "mine", label: `W realizacji` },
          { value: "completed", label: `Zakończone` },
          { value: "failedReturns", label: `Zwroty do realizacji ` },
        ]}
      />
    </div>
  )
}

export default TabsSection
