import { useState } from "react"
import { OfferService } from "@/shared/api/services/OfferService"
import { useAppStore } from "@/shared/store/appStore"

type UseAcceptOfferArgs = {
  offerId: number | null
  onSuccess?: () => void
}

export function useAcceptOffer({ offerId, onSuccess }: UseAcceptOfferArgs) {
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)
  const inc = useAppStore((s) => s.inc)

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
    } catch {
      setSubmitError("Nie udało się zaakceptować oferty.")
    } finally {
      setSubmitting(false)
    }
  }

  return {
    submitting,
    submitError,
    submit,
    reset,
  }
}
