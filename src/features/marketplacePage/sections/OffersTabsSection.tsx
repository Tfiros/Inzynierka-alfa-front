import SegmentedTabs from "@/features/Trades/TradePanelPage/components/SegmentedTabs"
import type { OffersType } from "@/shared/types/offerTypes/OfferTypes"

type Props = {
  value: OffersType
  onChange: (v: OffersType) => void
  offersCount: number
  counterOffersSentCount: number
  counterOffersReciveCount: number
}

const OffersTabsSection = ({
  value,
  onChange,
  offersCount,
  counterOffersSentCount,
  counterOffersReciveCount,
}: Props) => {
  return (
    <div className="mt-6">
      <SegmentedTabs
        value={value}
        onChange={onChange}
        tabs={[
          { value: "offers", label: `Oferty (${offersCount})` },
          {
            value: "counterOffersSent",
            label: `Wysłane Kontroferty (${counterOffersSentCount})`,
          },
          {
            value: "counterOffersRecive",
            label: `Otrzymane Kontroferty (${counterOffersReciveCount})`,
          },
        ]}
      />
    </div>
  )
}

export default OffersTabsSection
