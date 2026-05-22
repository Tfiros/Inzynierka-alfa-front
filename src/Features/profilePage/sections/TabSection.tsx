import { Card, CardContent } from "@/shared/components/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/tabs"
import { useState } from "react"
import { useUserOffers } from "../hooks/UseProfileOffers"
import Offer from "@/features/marketplacePage/components/Offer"
import OfferDetails from "@/features/marketplacePage/components/OfferDetails"
import { useOfferDetails } from "@/features/marketplacePage/hooks/UseOfferDetails"
import { useCounterOffers } from "../hooks/UseCounterOffers"
import { useUpdateCounterOfferStatus } from "../hooks/UseUpdateCounterOfferStatus"
import { UseAcceptCounterOffer } from "../hooks/UseAcceptCounterOffer"
import CounterOfferCard from "../component/CounterOfferCard"
import { CounterOfferStatus } from "@/shared/enums/counterOfferStatus"
import { Button } from "@/shared/components/button"
import { useAppStore } from "@/shared/store/appStore"
import { useFavouriteOffers } from "../hooks/UseFavouriteOffers"
import { useCancelCounterOffer } from "../hooks/UseCancelCounterOffer"
type ProfileTabViews =
  | "offers"
  | "counterOffersSent"
  | "counterOffersReceived"
  | "favourites"
  | "history"

const TabSection = ({ profileId }: { profileId: number }) => {
  const [tab, setTab] = useState<ProfileTabViews>("offers")

  const [activePage] = useState<number>(1)
  const [historyPage] = useState<number>(1)
  const [sentPage, setSentPage] = useState<number>(1)
  const [receivedPage, setReceivedPage] = useState<number>(1)
  const [favouritesPage, setFavouritesPage] = useState<number>(1)

  const [selectedOfferId, setSelectedOffer] = useState<number | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const update = useUpdateCounterOfferStatus()
  const cancel = useCancelCounterOffer()
  const acceptCounterOffer = UseAcceptCounterOffer()
  const pageSize = 10
  const currentUserId = useAppStore((s) => s.userId)
  const isOwnProfile = currentUserId === profileId

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
  } = useUserOffers(profileId, activePage, historyPage, pageSize)

  const sent = useCounterOffers(
    "sent",
    isOwnProfile && tab === "counterOffersSent",
    sentPage,
    pageSize,
    2
  )

  const received = useCounterOffers(
    "received",
    isOwnProfile && tab === "counterOffersReceived",
    receivedPage,
    pageSize,
    2
  )

  const { favouriteOffers, favouriteLoading, favouriteError } =
    useFavouriteOffers(
      isOwnProfile && tab === "favourites",
      favouritesPage,
      pageSize
    )

  const activeOffersList = activeOffers?.elements ?? []
  const historyOffersList = historyOffers?.elements ?? []
  const sentList = sent.data?.elements ?? []
  const receivedList = received.data?.elements ?? []
  const favouritesList = favouriteOffers?.elements ?? []

  const requestCounterOffer = useAppStore((s) => s.counterOfferRequest)

  return (
    <section>
      <Tabs
        value={tab}
        onValueChange={(value) => {
          const nextTab = value as ProfileTabViews

          if (
            !isOwnProfile &&
            (nextTab === "counterOffersSent" ||
              nextTab === "counterOffersReceived" ||
              nextTab === "favourites")
          ) {
            setTab("offers")
            return
          }

          setTab(nextTab)
        }}
        className="mt-6"
      >
        <TabsList
          className={`w-full grid ${isOwnProfile ? "grid-cols-5" : "grid-cols-2"}`}
        >
          <TabsTrigger value="offers">
            {isOwnProfile ? "Moje Oferty" : "Oferty"}
          </TabsTrigger>

          {isOwnProfile && (
            <>
              <TabsTrigger value="counterOffersSent">
                Wysłane Kontroferty
              </TabsTrigger>

              <TabsTrigger value="counterOffersReceived">
                Otrzymane Kontroferty
              </TabsTrigger>
              <TabsTrigger value="favourites">Ulubione</TabsTrigger>
            </>
          )}

          <TabsTrigger value="history">Historia wymian</TabsTrigger>
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
                {isOwnProfile
                  ? "Oferty wymian, które obecnie masz wystawione na platformie"
                  : "Oferty wymian wystawione przez tego użytkownika"}
              </div>
              <div className="grid xl:grid-cols-2 gap-6">
                {activeOffersList.map((o) => (
                  <Offer
                    key={o.offerCoreDto.offerId}
                    offer={o}
                    onShowDetails={handleShowDetails}
                    onOpenCounterOffer={requestCounterOffer}
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
          ) : sentList.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Brak wysłanych kontrofert.
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid xl:grid-cols-2 gap-4">
                {sentList.map((co) => (
                  <CounterOfferCard
                    key={co.counterOfferId}
                    data={co}
                    variant="sent"
                    onOpenOffer={handleShowDetails}
                    actionsDisabled={cancel.loadingId === co.counterOfferId}
                    onCancel={async (id) => {
                      await cancel.cancelStatus(id)
                    }}
                  />
                ))}
              </div>

              {sent.data && sent.data.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    disabled={sentPage <= 1 || sent.loading}
                    onClick={() => setSentPage((p) => Math.max(1, p - 1))}
                  >
                    Poprzednia
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    Strona {sent.data.page} z {sent.data.totalPages}
                  </span>

                  <Button
                    variant="outline"
                    disabled={sentPage >= sent.data.totalPages || sent.loading}
                    onClick={() => setSentPage((p) => p + 1)}
                  >
                    Następna
                  </Button>
                </div>
              )}
            </>
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
          ) : receivedList.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Brak otrzymanych kontrofert.
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid xl:grid-cols-2 gap-4">
                {receivedList.map((co) => {
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
                      onDeny={async (id) => {
                        await update.updateStatus(id, CounterOfferStatus.Denied)
                      }}
                      onAccept={async (id) => {
                        await acceptCounterOffer.accept(id)
                      }}
                    />
                  )
                })}
              </div>

              {received.data.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    disabled={receivedPage <= 1 || received.loading}
                    onClick={() => setReceivedPage((p) => Math.max(1, p - 1))}
                  >
                    Poprzednia
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    Strona {received.data.page} z {received.data.totalPages}
                  </span>

                  <Button
                    variant="outline"
                    disabled={
                      receivedPage >= received.data.totalPages ||
                      received.loading
                    }
                    onClick={() => setReceivedPage((p) => p + 1)}
                  >
                    Następna
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="favourites" className="mt-4">
          {favouriteLoading || favouriteOffers == null ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Ładowanie ulubionych ofert...
              </CardContent>
            </Card>
          ) : favouriteError ? (
            <Card>
              <CardContent className="p-6 text-sm text-red-500">
                {favouriteError}
              </CardContent>
            </Card>
          ) : favouritesList.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Brak ulubionych ofert.
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-3">
                Ulubione oferty
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {favouritesList.map((f) => (
                  <Offer
                    key={f.offerCoreDto.offerId}
                    offer={f}
                    onShowDetails={handleShowDetails}
                    onOpenCounterOffer={requestCounterOffer}
                  />
                ))}
              </div>
              {favouriteOffers.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    disabled={favouritesPage <= 1 || favouriteLoading}
                    onClick={() => setFavouritesPage((p) => Math.max(1, p - 1))}
                  >
                    Poprzednia
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Strona {favouriteOffers.page} z {favouriteOffers.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={
                      favouritesPage >= favouriteOffers.totalPages ||
                      favouriteLoading
                    }
                    onClick={() => setFavouritesPage((p) => p + 1)}
                  >
                    Następna
                  </Button>
                </div>
              )}
            </>
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
                    onOpenCounterOffer={requestCounterOffer}
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
