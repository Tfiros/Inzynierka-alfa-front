import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/alert-dialog"
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog"
import { useAppStore } from "@/shared/store/appStore"
import { useDeleteOffer } from "../hooks/UseDeleteOffer"

const OfferDeleteConfirmationDialog = () => {
  const open = useAppStore((s) => s.offerDeleteConfirmOpen)
  const setOpen = useAppStore((s) => s.setOfferDeleteConfirmOpen)
  const offerId = useAppStore((s) => s.offerId)

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
            className={
              deleter.isLoading || offerId == null ? "" : "cursor-pointer"
            }
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
