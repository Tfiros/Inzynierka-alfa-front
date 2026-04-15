import { Card, CardContent } from "@/shared/components/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/tabs"
import { useEffect, useState } from "react"
import { useUserOffers } from "../hooks/UseProfileOffers"
import Offer from "@/Features/marketplacePage/components/Offer"
import { useOfferDetails } from "@/Features/marketplacePage/hooks/UseOfferDetails"
import OfferDetails from "@/Features/marketplacePage/components/OfferDetails"

const TabSection = ({ profileId }: { profileId: number }) => {
  const [tab, setTab] = useState<"offers" | "history">("offers")
  const [activePage, setActivePage] = useState<number>(1)
  const [historyPage, setHistoryPage] = useState<number>(1)
  const pageSize = 10
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

  const {
    activeOffers,
    historyOffers,
    loadingActive,
    loadingHistory,
    errorActive,
    errorHistory,
    fetchHistoryOffers,
  } = useUserOffers(profileId, activePage, historyPage, pageSize)

  useEffect(() => {
    if (tab === "history") {
      void fetchHistoryOffers()
    }
  }, [tab, fetchHistoryOffers])

  const activeOffersList = activeOffers?.elements ?? []
  const historyOffersList = historyOffers?.elements ?? []
  return (
    <section>
      <Tabs defaultValue="offers" className="mt-6">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="offers" onClick={() => setTab("offers")}>
            Moje wystawione oferty
          </TabsTrigger>
          <TabsTrigger value="history" onClick={() => setTab("history")}>
            Historia wymian
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offers" className="mt-4">
          {loadingActive && activeOffers == null ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Ładowanie aktywnych ofert...
              </CardContent>
            </Card>
          ) : errorActive ? (
            <Card>
              <CardContent className="p-6 text-sm text-red-500">
                {errorActive}
              </CardContent>
            </Card>
          ) : activeOffersList.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Brak aktywnych ofert.
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-3">
                Oferty wymian, które obecnie masz wystawione na platformie
              </div>
              <div className="grid xl:grid-cols-2 gap-6">
                {activeOffersList.map((o) => (
                  <Offer
                    key={o.offerCoreDto.offerId}
                    offer={o}
                    onShowDetails={handleShowDetails}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {loadingHistory && tab == "history" && historyOffers == null ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Ładowanie historii wymian...
              </CardContent>
            </Card>
          ) : errorHistory ? (
            <Card>
              <CardContent className="p-6 text-sm text-red-500">
                {errorHistory}
              </CardContent>
            </Card>
          ) : historyOffersList.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Brak historii wymian.
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-3">
                Historia Twoich wymian
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {historyOffersList.map((o) => (
                  <Offer
                    key={o.offerCoreDto.offerId}
                    offer={o}
                    onShowDetails={handleShowDetails}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
      {detailsOffer && (
        <OfferDetails
          offer={detailsOffer}
          open={detailsOpen}
          onOpenChange={handleOpenDialogChange}
        />
      )}
    </section>
  )
}

export default TabSection
