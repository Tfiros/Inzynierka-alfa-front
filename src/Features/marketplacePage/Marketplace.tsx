import OffersGrid from "./components/OffersGrid"
import FilterBarContainer from "./components/FilterBarContainer"
import OfferDetails from "./components/OfferDetails"
import { useState } from "react"
import { useOffersListing } from "./hooks/UseOfferListing"
import { useOfferDetails } from "./hooks/UseOfferDetails"
import { Plus } from "lucide-react"
import { Button } from "@/shared/components/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination"
import { useAppStore } from "@/shared/store/appStore"
import OffersTabsSection from "./components/OffersTabsSection"
import type { OffersType } from "@/shared/types/offerTypes/OfferTypes"

const MarketplacePage = () => {
  const {
    offers,
    totalCount,
    totalPages,
    page,
    setPage,
    loading,
    error,
    searchText,
    setSearchText,
    orderBy,
    setOrderBy,
  } = useOffersListing()

  const [selectedOfferId, setSelectedOffer] = useState<number | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const {
    offerDetails: detailsOffer,
    loading: detailsLoading,
    error: detailsError,
  } = useOfferDetails(selectedOfferId, detailsOpen)

  const requestCreate = useAppStore((s) => s.offerRequestCreate)

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

  const [tab, setTab] = useState<OffersType>("offers")

  return (
    <>
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
          <div className="flex items-center gap-3 md:self-end">
            <div className="text-sm text-muted-foreground md:text-right md:self-end">
              <p>{totalCount} znalezionych ofert</p>
            </div>
            <Button
              type="button"
              className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
              size="lg"
              onClick={() => {
                requestCreate()
              }}
              disabled={!isAuthenticated}
            >
              <Plus className="mr-2 h-4 w-4" />
              Dodaj ofertę
            </Button>
          </div>
        </header>
        <OffersTabsSection
          value={tab}
          onChange={setTab}
          offersCount={0}
          counterOffersSentCount={0}
          counterOffersReciveCount={0}
        />
        <FilterBarContainer />
        {error && <p className="text-red-500">Błąd: {error}</p>}
        {loading && (
          <p className="text-sm text-muted-foreground">Ładowanie ofert...</p>
        )}
        <OffersGrid offers={offers} onShowDetails={handleShowDetails} />
        {!loading && totalCount > 0 && totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(Math.max(1, page - 1))
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {getPageItems(page, totalPages).map((p, idx) =>
                p === "..." ? (
                  <PaginationItem key={`dots-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={(e) => {
                        e.preventDefault()
                        setPage(p)
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(Math.min(totalPages, page + 1))
                  }}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        {detailsOffer && (
          <OfferDetails
            offer={detailsOffer}
            open={detailsOpen}
            onOpenChange={handleOpenDialogChange}
          />
        )}
      </div>
    </>
  )
}

export default MarketplacePage

function getPageItems(current: number, total: number): Array<number | "..."> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const items: Array<number | "..."> = [1]
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)

  if (left > 2) items.push("...")
  for (let p = left; p <= right; p++) items.push(p)
  if (right < total - 1) items.push("...")

  items.push(total)
  return items
}
