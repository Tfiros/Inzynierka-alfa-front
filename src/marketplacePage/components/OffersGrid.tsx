import type { OfferType } from '../offer'
import Offer from './Offer'
const OffersGrid = ({ offers }: { offers: OfferType[] }) => {
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
        <Offer key={offer.id} offer={offer} />
      ))}
    </div>
  )
}

export default OffersGrid
