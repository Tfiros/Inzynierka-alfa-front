import { useState } from "react"
import { OfferService } from "@/shared/api/services/OfferService"
import { useAppStore } from "@/shared/store/appStore"
import { extractErrorMessage } from "@/shared/utilities/errorHandlers"

type UseAcceptOfferArgs = {
  offerId: number | null
  tokensWanted?: number
  onSuccess?: () => void
}

export function useAcceptOffer({
  offerId,
  tokensWanted = 0,
  onSuccess,
}: UseAcceptOfferArgs) {
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)
  const inc = useAppStore((s) => s.inc)
  const navbarUser = useAppStore((s) => s.navbarUser)
  const canAfford = navbarUser === null || navbarUser.tokens >= tokensWanted

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const reset = () => setSubmitError(null)

  const submit = async () => {
    if (!offerId || submitting) return

    try {
      setSubmitting(true)
      setSubmitError(null)

      const res = await OfferService.accept(offerId)

      if (!res.isSuccess || !res.data) {
        setSubmitError(res.message ?? "Nie udało się zaakceptować oferty.")
        return
      }

      inc("offers:list")
      inc("offers:my")
      inc("counterOffers:sent")
      inc("counterOffers:received")
      void refreshNavbar()
      onSuccess?.()
    } catch (e) {
      setSubmitError(
        `Nie udało się zaakceptować oferty: ${extractErrorMessage(e)}`
      )
    } finally {
      setSubmitting(false)
    }
  }

  return {
    submitting,
    submitError,
    canAfford,
    submit,
    reset,
  }
}
