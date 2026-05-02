import CounterOfferCard from "@/features/profilePage/component/CounterOfferCard"
import { CounterOfferStatus } from "@/shared/enums/counterOfferStatus"
import { useOfferCounterOffers } from "../hooks/UseOfferCounterOffers"
import { useUpdateCounterOfferStatus } from "@/features/profilePage/hooks/UseUpdateCounterOfferStatus"
import { UseAcceptCounterOffer } from "@/features/profilePage/hooks/UseAcceptCounterOffer"

type Props = {
  offerId: number
  open: boolean
}

const OfferCounterOffersSection = ({ offerId, open }: Props) => {
  const list = useOfferCounterOffers(offerId, open)
  const update = useUpdateCounterOfferStatus()
  const accept = UseAcceptCounterOffer()

  if (list.loading) {
    return (
      <div className="rounded-xl border bg-background px-3 py-3 text-sm text-muted-foreground">
        Ładowanie kontrofert...
      </div>
    )
  }

  if (list.error) {
    return (
      <div className="rounded-xl border bg-background px-3 py-3 text-sm text-red-500">
        {list.error}
      </div>
    )
  }

  if (list.data.length === 0) {
    return (
      <div className="rounded-xl border bg-background px-3 py-3 text-sm text-muted-foreground">
        Brak oczekujących kontrofert.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {list.data.map((co) => {
        const isBusy =
          update.loadingId === co.counterOfferId ||
          accept.loadingId === co.counterOfferId

        return (
          <CounterOfferCard
            key={co.counterOfferId}
            data={co}
            variant="received"
            actionsDisabled={isBusy}
            onCancel={async (id) => {
              await update.updateStatus(id, CounterOfferStatus.Denied)
              await list.reload()
            }}
            onAccept={async (id) => {
              await accept.accept(id)
              await list.reload()
            }}
          />
        )
      })}
    </div>
  )
}

export default OfferCounterOffersSection
