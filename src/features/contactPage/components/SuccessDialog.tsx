import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/alert-dialog"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SuccessDialog = ({ open, onOpenChange }: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Wiadomość wysłana</AlertDialogTitle>
          <AlertDialogDescription>
            Dziękujemy za kontakt. Twoja wiadomość została wysłana. Proszę
            czekaj na kontakt od jednego z naszych pracowników.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Zamknij
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SuccessDialog
