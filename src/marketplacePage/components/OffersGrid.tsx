import type { OfferType } from '../offer'
import Offer from './Offer'
type OfferGridProps = {
  offers: OfferType[]
  onShowDetails: (offer: OfferType) => void
}
const OffersGrid = ({ offers, onShowDetails }: OfferGridProps) => {
  if (!offers || offers.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border text-sm text-muted-foreground h-32">
        <p>Brak ofert do wyświetlenia.</p>
      </div>
    )
  }
  return (
    <div className="grid xl:grid-cols-2 gap-6">
      {offers.map((offer) => (
        <Offer key={offer.id} offer={offer} onShowDetails={onShowDetails} />
      ))}
    </div>
  )
}

export default OffersGrid
