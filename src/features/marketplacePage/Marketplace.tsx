import { Plus, RotateCcw } from "lucide-react"
import { Button } from "@/shared/components/button"
import { UniversalPagination } from "@/shared/components/Pagination"
import { useAppStore } from "@/shared/store/appStore"
import { useCallback, useState } from "react"
import FilterBar from "./components/FilterBar"
import OffersGrid from "./components/OffersGrid"
import { useOffersListing } from "./hooks/UseOfferListing"
import OfferDetails from "@/shared/components/offers/OfferDetails"
import { useOfferDetails } from "@/shared/hooks/UseOfferDetails"

const MarketplacePage = () => {
  const {
    offers,
    totalCount,
    totalPages,
    page,
    pageSize,
    setPage,
    loading,
    error,
    searchText,
    setSearchText,
    orderBy,
    setOrderBy,
    gameId,
    setGameId,
    genreId,
    setGenreId,
    rarityId,
    setRarityId,
    games,
    genres,
    rarities,
    refreshOffers,
  } = useOffersListing()

  const [selectedOfferId, setSelectedOffer] = useState<number | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const requestCounterOffer = useAppStore((s) => s.counterOfferRequest)

  const { offerDetails: detailsOffer } = useOfferDetails(
    selectedOfferId,
    detailsOpen
  )

  const requestCreate = useAppStore((s) => s.offerRequestCreate)

  const handleShowDetails = useCallback((offerId: number) => {
    setSelectedOffer(offerId)
    setDetailsOpen(true)
  }, [])
  const handleOpenDialogChange = (open: boolean) => {
    setDetailsOpen(open)
    if (!open) {
      setSelectedOffer(null)
    }
  }

  return (
    <>
      <div className="mx-auto flex flex-col gap-6 py-6 lg:py-10">
        <header className="flex flex-col gap-3 pb-2 md:flex-row md:items-center md:justify-between">
          <div className="text-left">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Marketplace
            </h1>
            <p className="text-muted-foreground">
              Przeglądaj oferty wymiany i znajdź najlepsze okazje!
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 md:self-end">
            <div className="text-sm text-muted-foreground md:text-right md:self-end">
              <p>{totalCount} znalezionych ofert</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={refreshOffers}
                className="cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Odśwież
              </Button>
            </div>
          </div>
        </header>
        <FilterBar
          searchText={searchText}
          onSearchTextChange={setSearchText}
          gameId={gameId}
          onGameIdChange={setGameId}
          games={games}
          genreId={genreId}
          onGenreIdChange={setGenreId}
          genres={genres}
          rarityId={rarityId}
          onRarityIdChange={setRarityId}
          rarities={rarities}
          orderBy={orderBy}
          onOrderByChange={setOrderBy}
        />
        {error && <p className="text-red-500">Błąd: {error}</p>}

        {loading && (
          <p className="text-sm text-muted-foreground">Ładowanie ofert...</p>
        )}

        <OffersGrid
          offers={offers}
          onShowDetails={handleShowDetails}
          onOpenCounterOffer={requestCounterOffer}
        />

        {!loading && totalCount > 0 && totalPages > 1 && (
          <UniversalPagination
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            loading={loading}
          />
        )}

        {detailsOffer && (
          <OfferDetails
            offer={detailsOffer}
            open={detailsOpen}
            onOpenChange={handleOpenDialogChange}
          />
        )}
      </div>
      <Button
        type="button"
        className={`fixed bottom-6 right-6 z-50 rounded-full shadow-lg ${
          isAuthenticated ? "cursor-pointer" : ""
        }`}
        size="lg"
        onClick={() => {
          requestCreate()
        }}
        disabled={!isAuthenticated}
      >
        <Plus className="mr-2 h-4 w-4" />
        Dodaj ofertę
      </Button>
    </>
  )
}

export default MarketplacePage
