import OffersGrid from "./components/OffersGrid"
import FilterBarContainer from "./components/FilterBarContainer"
import OfferDetails from "./components/OfferDetails"
import { useState } from "react"
import type { OfferType } from "./offer"

const Marketplace = () => {
  const oferty = 15
  const [selectedOffer, setSelectedOffer] = useState<OfferType | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const handleShowDetails = (offer: OfferType) => {
    setSelectedOffer(offer)
    setDetailsOpen(true)
  }
  const handleOpenDialogChange = (open: boolean) => {
    setDetailsOpen(open)
    if (!open) {
      setSelectedOffer(null)
    }
  }
  return (
    <div className="mx-auto flex flex-col gap-6  py-6 lg:py-10">
      <header className="flex flex-col gap-3 pb-2 md:flex-row md:items-center md:justify-between">
        <div className="text-left">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Marketplace
          </h1>
          <p className="text-muted-foreground">
            Przeglądaj oferty wymiany i znajdź najlepsze okazje!
          </p>
        </div>
        <div className="text-sm text-muted-foreground md:text-right md:self-end">
          <p>{oferty} znalezionych ofert</p>
        </div>
      </header>
      <FilterBarContainer />
      <OffersGrid offers={[]} onShowDetails={handleShowDetails} />
      {selectedOffer && (
        <OfferDetails
          offer={selectedOffer}
          open={detailsOpen}
          onOpenChange={handleOpenDialogChange}
        />
      )}
    </div>
  )
}

export default Marketplace
