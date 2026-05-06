import { Dialog, DialogContent } from "@/shared/components/dialog"
import { useAppStore } from "@/shared/store/appStore"
import AcceptOfferModalContent from "./AcceptOfferModalContent"

type Props = {
  onRefreshOffers?: () => Promise<void>
}

const AcceptOfferInteractionHost = ({ onRefreshOffers }: Props) => {
  const open = useAppStore((s) => s.acceptOfferOpen)
  const setOpen = useAppStore((s) => s.setAcceptOfferOpen)
  const targetOfferId = useAppStore((s) => s.acceptOfferOfferId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <AcceptOfferModalContent
          offerId={targetOfferId}
          onCancel={() => setOpen(false)}
          onRefreshOffers={onRefreshOffers}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AcceptOfferInteractionHost
