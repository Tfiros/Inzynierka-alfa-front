import { useCallback, useState } from "react"
import { useAppStore } from "../store/appStore"
import { CounterOfferService } from "../api/services/CounterOfferService"
import { toast } from "sonner"

export const useRequestOfferEdit = () => {
  const openEdit = useAppStore((s) => s.offerRequestEdit)
  const [isChecking, setIsChecking] = useState(false)

  const requestEdit = useCallback(
    async (offerId: number) => {
      setIsChecking(true)
      let hasPending = false
      try {
        const res = await CounterOfferService.hasPendingOffer(offerId)
        hasPending = res.isSuccess && res.data === true
      } catch (e) {
        console.error("pending counter-offer pre-check failed", e)
      } finally {
        setIsChecking(false)
      }
      if (hasPending) {
        toast.error("Musisz odpowiedzieć na kontroferty przed edycją oferty.")
        return false
      }
      openEdit(offerId)
      return true
    },
    [openEdit]
  )
  return { requestEdit, isChecking }
}
