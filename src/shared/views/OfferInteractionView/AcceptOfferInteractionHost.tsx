import { Dialog, DialogContent } from "@/shared/components/dialog"
import { useAppStore } from "@/shared/store/appStore"
import AcceptOfferModalContent from "./AcceptOfferModalContent"

const AcceptOfferInteractionHost = () => {
  const open = useAppStore((s) => s.acceptOfferOpen)
  const setOpen = useAppStore((s) => s.setAcceptOfferOpen)
  const targetOfferId = useAppStore((s) => s.acceptOfferOfferId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <AcceptOfferModalContent
          offerId={targetOfferId}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AcceptOfferInteractionHost
