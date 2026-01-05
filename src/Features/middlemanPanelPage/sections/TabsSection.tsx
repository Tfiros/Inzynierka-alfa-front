import type { MiddlemanTab } from "@/shared/types/middlemanTypes/MiddlemanTypes"
import SegmentedTabs from "../components/SegmentedTabs"

type Props = {
  value: MiddlemanTab
  onChange: (v: MiddlemanTab) => void
  availableCount: number
  mineCount: number
  finishedCount: number
}

const TabsSection = ({
  value,
  onChange,
  availableCount,
  mineCount,
  finishedCount,
}: Props) => {
  return (
    <div className="mt-6">
      <SegmentedTabs
        value={value}
        onChange={onChange}
        tabs={[
          { value: "available", label: `Dostępne oferty (${availableCount})` },
          { value: "mine", label: `Moje przypisane (${mineCount})` },
          { value: "finished", label: `Zakończone (${finishedCount})` },
        ]}
      />
    </div>
  )
}
export default TabsSection
