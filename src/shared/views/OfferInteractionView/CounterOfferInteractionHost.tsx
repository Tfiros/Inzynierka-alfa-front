import { Dialog, DialogContent } from "@/shared/components/dialog"
import { useAppStore } from "@/shared/store/appStore"
import CreateCounterOfferModalContent from "./views/CreateCounterOfferModalContent"

const CounterOfferInteractionHost = () => {
  const open = useAppStore((s) => s.counterOfferOpen)
  const setOpen = useAppStore((s) => s.setCounterOfferOpen)
  const targetOfferId = useAppStore((s) => s.counterOfferOfferId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl">
        <CreateCounterOfferModalContent
          offerId={targetOfferId}
          onCancel={() => {
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CounterOfferInteractionHost
