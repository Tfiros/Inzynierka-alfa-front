import { useAppStore } from "@/shared/store/appStore"
import OfferInteractionModal from "./OfferInteractionModal"
import OfferDeleteConfirmationDialog from "./views/OfferDeleteConfirmationDialog"

const OfferInteractionHost = () => {
  const interactionOpen = useAppStore((s) => s.offerInteractionOpen)
  const mode = useAppStore((s) => s.offerMode)
  const offerId = useAppStore((s) => s.offerId)
  const setInteractionOpen = useAppStore((s) => s.setOfferInteractionOpen)

  return (
    <>
      <OfferInteractionModal
        open={interactionOpen}
        onOpenChange={setInteractionOpen}
        mode={mode}
        offerId={offerId}
      />
      <OfferDeleteConfirmationDialog />
    </>
  )
}

export default OfferInteractionHost
