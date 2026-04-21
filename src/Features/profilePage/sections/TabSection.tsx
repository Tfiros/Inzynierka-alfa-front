import { Card, CardContent } from "@/shared/components/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/tabs"
import { useEffect, useState } from "react"
import { useUserOffers } from "../hooks/UseProfileOffers"
import Offer from "@/features/marketplacePage/components/Offer"
import OfferDetails from "@/features/marketplacePage/components/OfferDetails"
import { useOfferDetails } from "@/features/marketplacePage/hooks/UseOfferDetails"
import { useCounterOffers } from "../hooks/UseCounterOffers"
import { useUpdateCounterOfferStatus } from "../hooks/UseUpdateCounterOfferStatus"
import { useCounterOfferModal } from "@/features/marketplacePage/hooks/UseCounterOfferModal"
import { UseAcceptCounterOffer } from "../hooks/UseAcceptCounterOffer"
import CounterOfferCard from "../component/CounterOfferCard"
import { CounterOfferStatus } from "@/shared/enums/counterOfferStatus"

const TabSection = ({ profileId }: { profileId: number }) => {
  const [tab, setTab] = useState<
    "offers" | "counterOffersSent" | "counterOffersReceived" | "history"
  >("offers")

  const [activePage, setActivePage] = useState<number>(1)
  const [historyPage, setHistoryPage] = useState<number>(1)
  const pageSize = 10

  const [selectedOfferId, setSelectedOffer] = useState<number | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const update = useUpdateCounterOfferStatus()
  const acceptCounterOffer = UseAcceptCounterOffer()

  const { offerDetails: detailsOffer } = useOfferDetails(
    selectedOfferId,
    detailsOpen
  )

  const handleShowDetails = (offerId: number) => {
    setSelectedOffer(offerId)
    setDetailsOpen(true)
  }

  const handleOpenDialogChange = (open: boolean) => {
    setDetailsOpen(open)
    if (!open) setSelectedOffer(null)
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

  const sent = useCounterOffers("sent", tab === "counterOffersSent")
  const received = useCounterOffers("received", tab === "counterOffersReceived")

  useEffect(() => {
    if (tab === "history") {
      void fetchHistoryOffers()
    }
  }, [tab, fetchHistoryOffers])

  const activeOffersList = activeOffers?.elements ?? []
  const historyOffersList = historyOffers?.elements ?? []

  const counter = useCounterOfferModal()

  return (
    <section>
      <Tabs
        value={tab}
        onValueChange={(value) =>
          setTab(
            value as
              | "offers"
              | "counterOffersSent"
              | "counterOffersReceived"
              | "history"
          )
        }
        className="mt-6"
      >
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="offers">Moje Oferty</TabsTrigger>

          <TabsTrigger value="counterOffersSent">
            Wysłane Kontroferty
          </TabsTrigger>

          <TabsTrigger value="counterOffersReceived">
            Otrzymane Kontroferty
          </TabsTrigger>

          <TabsTrigger value="history">Historia wymian</TabsTrigger>
        </TabsList>

        <TabsContent value="offers" className="mt-4">
          {loadingActive || activeOffers == null ? (
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
                    onOpenCounterOffer={(offerId) =>
                      void counter.openForOffer(offerId)
                    }
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="counterOffersSent" className="mt-4">
          {sent.loading || sent.data == null ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Ładowanie wysłanych kontrofert...
              </CardContent>
            </Card>
          ) : sent.error ? (
            <Card>
              <CardContent className="p-6 text-sm text-red-500">
                {sent.error}
              </CardContent>
            </Card>
          ) : sent.data.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Brak wysłanych kontrofert.
              </CardContent>
            </Card>
          ) : (
            <div className="grid xl:grid-cols-2 gap-4">
              {sent.data.map((co) => (
                <CounterOfferCard
                  key={co.counterOfferId}
                  data={co}
                  variant="sent"
                  onOpenOffer={handleShowDetails}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="counterOffersReceived" className="mt-4">
          {received.loading || received.data == null ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Ładowanie otrzymanych kontrofert...
              </CardContent>
            </Card>
          ) : received.error ? (
            <Card>
              <CardContent className="p-6 text-sm text-red-500">
                {received.error}
              </CardContent>
            </Card>
          ) : received.data.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Brak otrzymanych kontrofert.
              </CardContent>
            </Card>
          ) : (
            <div className="grid xl:grid-cols-2 gap-4">
              {received.data.map((co) => {
                const isBusy =
                  update.loadingId === co.counterOfferId ||
                  acceptCounterOffer.loadingId === co.counterOfferId

                return (
                  <CounterOfferCard
                    key={co.counterOfferId}
                    data={co}
                    variant="received"
                    onOpenOffer={handleShowDetails}
                    actionsDisabled={isBusy}
                    onCancel={async (id) => {
                      await update.updateStatus(id, CounterOfferStatus.Denied)
                    }}
                    onAccept={async (id) => {
                      await acceptCounterOffer.accept(id)
                    }}
                  />
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {loadingHistory || historyOffers == null ? (
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
                    onOpenCounterOffer={(offerId) =>
                      void counter.openForOffer(offerId)
                    }
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
