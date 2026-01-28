import type { MiddlemanTab } from "@/shared/types/tradeTypes/MiddlemanTypes"
import SegmentedTabs from "../components/SegmentedTabs"

type Props = {
  value: MiddlemanTab
  onChange: (v: MiddlemanTab) => void
  availableCount: number
  mineCount: number
  completedCount: number
}

const TabsSection = ({
  value,
  onChange,
  availableCount,
  mineCount,
  completedCount,
}: Props) => {
  return (
    <div className="mt-6">
      <SegmentedTabs
        value={value}
        onChange={onChange}
        tabs={[
          { value: "available", label: `Dostępne (${availableCount})` },
          { value: "mine", label: `W realizacji (${mineCount})` },
          { value: "completed", label: `Zakończone (${completedCount})` },
        ]}
      />
    </div>
  )
}

export default TabsSection
