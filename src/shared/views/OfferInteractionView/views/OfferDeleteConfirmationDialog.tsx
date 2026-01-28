import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/alert-dialog"
import { useDeleteOffer } from "../hooks/useDeleteOffer"
import { useOfferInteractionStore } from "../offerInteractionStore"
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog"

const OfferDeleteConfirmationDialog = () => {
  const open = useOfferInteractionStore((s) => s.deleteConfirmOpen)
  const setOpen = useOfferInteractionStore((s) => s.setDeleteConfirmOpen)
  const offerId = useOfferInteractionStore((s) => s.offerId)

  const deleter = useDeleteOffer()

  const confirm = async () => {
    if (offerId == null) return
    const ok = await deleter.deleteOffer(offerId)
    if (!ok) return
    setOpen(false)
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) deleter.reset()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usunąć ofertę?</AlertDialogTitle>
          <AlertDialogDescription>
            Ta operacja usunie Twoją ofert.
            {deleter.error && (
              <div className="mt-2 text-sm text-red-500">{deleter.error}</div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleter.isLoading}>
            Anuluj
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={deleter.isLoading || offerId == null}
            onClick={(e) => {
              e.preventDefault()
              void confirm()
            }}
          >
            {deleter.isLoading ? "Usuwanie" : "Usuń"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default OfferDeleteConfirmationDialog
