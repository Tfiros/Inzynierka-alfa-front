import OffersGrid from "./components/OffersGrid"
import FilterBarContainer from "./components/FilterBarContainer"
import OfferDetails from "./components/OfferDetails"
import { useState } from "react"
import { useOffersListing } from "./hooks/useOfferListing"
import { useOfferDetails } from "./hooks/useOfferDetails"

const MarketplacePage = () => {
  const {
    offers,
    totalCount,
    loading,
    error,
    searchText,
    setSearchText,
    orderBy,
    setOrderBy,
  } = useOffersListing()

  const [selectedOfferId, setSelectedOffer] = useState<number | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const {
    offerDetails: detailsOffer,
    loading: detailsLoading,
    error: detailsError,
  } = useOfferDetails(selectedOfferId, detailsOpen)

  const handleShowDetails = (offerId: number) => {
    setSelectedOffer(offerId)
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
          <p>{totalCount} znalezionych ofert</p>
        </div>
      </header>
      <FilterBarContainer />
      {error && <p className="text-red-500">Błąd: {error}</p>}
      {loading && (
        <p className="text-sm text-muted-foreground">Ładowanie ofert...</p>
      )}
      <OffersGrid offers={offers} onShowDetails={handleShowDetails} />
      {detailsOffer && (
        <OfferDetails
          offer={detailsOffer}
          open={detailsOpen}
          onOpenChange={handleOpenDialogChange}
        />
      )}
    </div>
  )
}

export default MarketplacePage
