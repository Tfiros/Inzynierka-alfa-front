import { Dialog, DialogContent } from "@/shared/components/dialog"
import { useAppStore } from "@/shared/store/appStore"
import CreateCounterOfferModalContent from "./views/CreateCounterOfferModalContent"

const CounterOfferInteractionHost = () => {
  const open = useAppStore((s) => s.counterOfferOpen)
  const setOpen = useAppStore((s) => s.setCounterOfferOpen)
  const close = useAppStore((s) => s.closeCounterOffer)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <CreateCounterOfferModalContent onCancel={close} />
      </DialogContent>
    </Dialog>
  )
}

export default CounterOfferInteractionHost
