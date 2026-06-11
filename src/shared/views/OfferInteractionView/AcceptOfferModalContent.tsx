import { useState } from "react"
import { Check } from "lucide-react"

import { Button } from "@/shared/components/button"
import { DialogHeader, DialogTitle } from "@/shared/components/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/alert-dialog"

import PointsIcon from "@/shared/photos/PointsIcon.svg"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip"
import { useAcceptOffer } from "./hooks/UseAcceptOffer"
import { useAcceptOfferModal } from "./hooks/UseAcceptOfferModal"

type Props = {
  offerId: number | null
  onCancel: () => void
}

export default function AcceptOfferModalContent({ offerId, onCancel }: Props) {
  const [successOpen, setSuccessOpen] = useState(false)

  const { baseOffer, baseOfferLoading, baseOfferError } =
    useAcceptOfferModal(offerId)

  const { submitting, submitError, canAfford, submit } = useAcceptOffer({
    offerId,
    tokensWanted: baseOffer?.offerCoreDto.tokensWanted,
    onSuccess: () => {
      setSuccessOpen(true)
    },
  })

  const offeredItemsText =
    baseOffer?.offeredItems
      .slice(0, 3)
      .map((x) => {
        const itemName = x.itemDto.name
        const gameName = x.itemDto.game.name
        return gameName ? `${itemName} · ${gameName}` : itemName
      })
      .join(", ") ?? ""

  const wantedItemsText =
    baseOffer?.wantedItems
      .slice(0, 3)
      .map((x) => {
        const itemName = x.itemDto.name
        const gameName = x.itemDto.game.name
        return gameName ? `${itemName} · ${gameName}` : itemName
      })
      .join(", ") ?? ""

  return (
    <>
      <DialogHeader className="flex flex-col items-center gap-y-2">
        <DialogTitle className="text-lg font-semibold">
          Potwierdź wymianę
        </DialogTitle>
      </DialogHeader>

      <div className="mt-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
        {baseOfferLoading && (
          <p className="text-sm text-muted-foreground">Ładowanie oferty...</p>
        )}

        {!baseOfferLoading && baseOfferError && (
          <p className="text-sm text-red-500">{baseOfferError}</p>
        )}

        {!baseOfferLoading && !baseOfferError && baseOffer && (
          <div className="space-y-4">
            <div className="rounded-xl border bg-muted/20 px-4 py-3">
              <p className="text-sm text-muted-foreground">Otrzymasz</p>

              <p className="mt-1 text-sm font-medium line-clamp-2">
                {offeredItemsText || "Brak przedmiotów"}
                {baseOffer.offeredItems.length > 3 ? "..." : ""}
              </p>

              {baseOffer.offerCoreDto.tokensOffered > 0 && (
                <span className="mt-2 inline-flex w-fit items-center gap-1 text-sm font-medium text-amber-600">
                  + {baseOffer.offerCoreDto.tokensOffered}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img
                        src={PointsIcon}
                        alt="tokenów"
                        className="h-4 w-4 object-contain"
                      />
                    </TooltipTrigger>
                    <TooltipContent>tokenów</TooltipContent>
                  </Tooltip>
                </span>
              )}
            </div>

            <div className="rounded-xl border bg-muted/20 px-4 py-3">
              <p className="text-sm text-muted-foreground">Oddasz</p>

              <p className="mt-1 text-sm font-medium line-clamp-2">
                {wantedItemsText || "Brak przedmiotów"}
                {baseOffer.wantedItems.length > 3 ? "..." : ""}
              </p>

              {baseOffer.offerCoreDto.tokensWanted > 0 && (
                <span className="mt-2 inline-flex w-fit items-center gap-1 text-sm font-medium text-amber-600">
                  + {baseOffer.offerCoreDto.tokensWanted}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img
                        src={PointsIcon}
                        alt="tokenów"
                        className="h-4 w-4 object-contain"
                      />
                    </TooltipTrigger>
                    <TooltipContent>tokenów</TooltipContent>
                  </Tooltip>
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Po potwierdzeniu oferta zostanie przekazana do realizacji.
            </p>
          </div>
        )}

        {baseOffer && !canAfford && (
          <div className="mt-4 text-sm text-red-500">
            Za mało tokenów. Wymagane: {baseOffer.offerCoreDto.tokensWanted}
          </div>
        )}

        {submitError && (
          <div className="mt-4 text-sm text-red-500">{submitError}</div>
        )}

        <div className="mt-10 border-t pt-4 flex items-center gap-3">
          <Button
            className={
              !baseOffer || baseOfferLoading || submitting || !canAfford
                ? "h-10 flex-1 rounded-xl text-base font-semibold bg-black text-white border-black"
                : "h-10 flex-1 cursor-pointer rounded-xl text-base font-semibold bg-black text-white border-black"
            }
            disabled={
              !baseOffer || baseOfferLoading || submitting || !canAfford
            }
            onClick={() => {
              void submit()
            }}
          >
            <Check className="mr-2 h-5 w-5" />
            Wymień
          </Button>

          <Button
            variant="outline"
            className={
              submitting
                ? "h-10 rounded-xl px-8 text-base"
                : "h-10 cursor-pointer rounded-xl px-8 text-base"
            }
            onClick={onCancel}
            disabled={submitting}
          >
            Anuluj
          </Button>
        </div>
      </div>

      <AlertDialog open={successOpen} onOpenChange={setSuccessOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Wymiana została utworzona</AlertDialogTitle>
            <AlertDialogDescription>
              Oferta została zaakceptowana.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction
              onClick={async () => {
                setSuccessOpen(false)
                onCancel()
              }}
              className="cursor-pointer"
            >
              Zamknij
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
