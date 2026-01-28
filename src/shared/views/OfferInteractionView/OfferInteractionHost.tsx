import OfferInteractionModal from "./OfferInteractionModal"
import { useOfferInteractionStore } from "@/shared/views/OfferInteractionView/offerInteractionStore"
import OfferDeleteConfirmationDialog from "./views/OfferDeleteConfirmationDialog"

const OfferInteractionHost = () => {
  const interactionOpen = useOfferInteractionStore((s) => s.interactionOpen)
  const mode = useOfferInteractionStore((s) => s.mode)
  const offerId = useOfferInteractionStore((s) => s.offerId)
  const setInteractionOpen = useOfferInteractionStore(
    (s) => s.setInteractionOpen
  )

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
