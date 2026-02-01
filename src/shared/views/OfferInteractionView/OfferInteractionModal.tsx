import CreateOfferModalContent from "./views/CreateOfferModalContent"
import { Dialog, DialogContent } from "@/shared/components/dialog"
import EditOfferModalContent from "./views/EditOfferModalContent"
import { useCreateOffer } from "./hooks/UseCreateOffer"

type OfferInteractionModalTypes = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  offerId?: number | null
}

const OfferInteractionModal = ({
  open,
  onOpenChange,
  mode,
  offerId,
}: OfferInteractionModalTypes) => {
  const createOffer = useCreateOffer()
  const handleOpenChange = (v: boolean) => {
    onOpenChange(v)
    if (!v && mode === "create") createOffer.reset()
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[min(1100px,calc(100vw-2rem))] rounded-2xl gap-0 h-auto max-h-[calc(100vh-4rem)] p-6 flex-1 overflow-y-auto pr-1">
        {mode === "create" ? (
          <CreateOfferModalContent
            offer={createOffer}
            onCancel={() => handleOpenChange(false)}
          />
        ) : offerId != null ? (
          <EditOfferModalContent
            onCancel={() => handleOpenChange(false)}
            offerId={offerId}
          />
        ) : (
          <div className="p-6 text-sm text-muted-foreground">Brak oferty</div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default OfferInteractionModal
