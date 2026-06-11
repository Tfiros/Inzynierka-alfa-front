import { Badge } from "@/shared/components/badge"
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/dialog"
import OfferItemCard from "./OfferItemCard"
import { Button } from "@/shared/components/button"
import { Plus, SquarePen, Trash2 } from "lucide-react"
import type { offerDetailsDtoResponse } from "@/shared/types/offerTypes/RequestResponseTypes"
import { useAppStore } from "@/shared/store/appStore"
import { cn } from "@/shared/lib/utils"
import PointsIcon from "@/shared/photos/PointsIcon.svg"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip"
import { useState } from "react"
import OfferCounterOffersSection from "./OfferCounterOffersDetails"
import { useAcceptOffer } from "@/shared/views/OfferInteractionView/hooks/UseAcceptOffer"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/shared/components/alert-dialog"
import { useOfferPermissions } from "@/shared/hooks/UseOfferPermissions"
import { useRequestOfferEdit } from "@/shared/hooks/UseRequestOfferEdit"

type OfferDetailsProps = {
  offer: offerDetailsDtoResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

const OfferDetails = ({ offer, open, onOpenChange }: OfferDetailsProps) => {
  const requestDelete = useAppStore((s) => s.offerRequestDelete)
  const requestCounterOffer = useAppStore((s) => s.counterOfferRequest)
  const { requestEdit, isChecking } = useRequestOfferEdit()

  const { isOwner, isActive, isAuthenticated } = useOfferPermissions(
    offer.offerCoreDto.offerStatusId,
    offer.offerUserDto.userId
  )
  const [acceptConfirmOpen, setAcceptConfirmOpen] = useState(false)
  const [counterOffersOpen, setCounterOffersOpen] = useState(false)

  const handleAcceptSuccess = () => {
    setAcceptConfirmOpen(false)
    onOpenChange(false)
  }

  const acceptOffer = useAcceptOffer({
    offerId: offer.offerCoreDto.offerId,
    tokensWanted: offer.offerCoreDto.tokensWanted,
    onSuccess: handleAcceptSuccess,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-full max-h-[80vh] overflow-y-auto sm:min-w-3xl",
          !isActive && "bg-muted grayscale-75"
        )}
      >
        <DialogHeader className="flex flex-col sm:flex-row sm:justify-between mr-12">
          <div>
            <DialogTitle>{offer.offerCoreDto.title}</DialogTitle>
            <DialogDescription>
              {offer.offerCoreDto.description}
            </DialogDescription>
          </div>

          <div className="flex w-full flex-col gap-2 mt-2 sm:w-auto sm:flex-row">
            {isOwner ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs cursor-pointer w-full sm:w-auto"
                  onClick={async () => {
                    const opened = await requestEdit(offer.offerCoreDto.offerId)
                    if (opened) {
                      onOpenChange(false)
                    }
                  }}
                  disabled={!isActive || !isOwner || isChecking}
                >
                  <SquarePen className="mr-1 h-4 w-4" />{" "}
                  {isChecking ? "Sprawdzanie..." : "Edytuj"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="text-xs cursor-pointer w-full sm:w-auto"
                  onClick={() => {
                    onOpenChange(false)
                    requestDelete(offer.offerCoreDto.offerId)
                  }}
                  disabled={!isActive || !isOwner}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Usuń
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  className="text-xs cursor-pointer w-full sm:w-auto"
                  onClick={() => {
                    setAcceptConfirmOpen(true)
                  }}
                  disabled={
                    !isAuthenticated ||
                    !isActive ||
                    isOwner ||
                    acceptOffer.submitting
                  }
                >
                  {acceptOffer.submitting ? "Akceptuję..." : "Wymień"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs cursor-pointer w-full sm:w-auto"
                  onClick={() => {
                    onOpenChange(false)
                    requestCounterOffer(offer.offerCoreDto.offerId)
                  }}
                  disabled={!isActive || isOwner || !isAuthenticated}
                >
                  <Plus /> Złóż kontrofertę
                </Button>
              </>
            )}
          </div>
        </DialogHeader>

        <div className="mt-4">
          <div className="pb-4">
            <Badge className="w-full md:w-fit bg-gray-100 text-gray-900 rounded-full">
              Mam
            </Badge>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {offer.offeredItems.map((listingItemDto) => (
                <div
                  key={listingItemDto.itemDto.id}
                  className="h-full rounded-lg border border-gray-100 p-4 shadow-sm"
                >
                  <OfferItemCard listingItemDto={listingItemDto} />
                </div>
              ))}
            </div>
            {offer.offerCoreDto.tokensOffered > 0 && (
              <span className="mt-3 inline-flex w-fit items-center gap-1 text-sm font-medium text-amber-600">
                + {offer.offerCoreDto.tokensOffered}
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

          <div className="border-t pt-4">
            <Badge className="w-full md:w-fit rounded-full">Chcę</Badge>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {offer.wantedItems.map((listingItemDto) => (
                <div
                  key={listingItemDto.itemDto.id}
                  className="h-full rounded-lg border border-gray-100 p-4 shadow-sm"
                >
                  <OfferItemCard listingItemDto={listingItemDto} />
                </div>
              ))}
            </div>
          </div>
          {offer.offerCoreDto.tokensWanted > 0 && (
            <span className="mt-3 inline-flex w-fit items-center gap-1 text-sm font-medium text-amber-600">
              + {offer.offerCoreDto.tokensWanted}
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
        {isOwner && isActive && (
          <div className="mt-4 rounded-2xl border bg-muted/20 p-4">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 text-left cursor-pointer"
              onClick={() => setCounterOffersOpen((v) => !v)}
            >
              <div>
                <div className="text-sm font-semibold">Kontroferty</div>
                <div className="text-xs text-muted-foreground">
                  Zobacz propozycje złożone do tej oferty
                </div>
              </div>

              <span className="text-xs text-muted-foreground">
                {counterOffersOpen ? "Ukryj" : "Pokaż"}
              </span>
            </button>

            {counterOffersOpen && (
              <div className="mt-4 space-y-2">
                <OfferCounterOffersSection
                  offerId={offer.offerCoreDto.offerId}
                  open={counterOffersOpen}
                />
              </div>
            )}
          </div>
        )}
      </DialogContent>
      <AlertDialog
        open={acceptConfirmOpen}
        onOpenChange={(openState) => {
          if (acceptOffer.submitting) {
            return
          }
          setAcceptConfirmOpen(openState)
          if (!openState) acceptOffer.reset()
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Zaakceptować ofertę?</AlertDialogTitle>
            <AlertDialogDescription>
              Po potwierdzeniu zostanie utworzona wymiana dla tej oferty.{" "}
              {acceptOffer.submitError && (
                <div className="mt-2 text-sm text-red-500">
                  {acceptOffer.submitError}
                </div>
              )}
              {!acceptOffer.canAfford && (
                <div className="mt-2 text-sm text-red-500">
                  Za mało tokenów. Wymagane: {offer.offerCoreDto.tokensWanted}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={acceptOffer.submitting}>
              Wróć
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={acceptOffer.submitting || !acceptOffer.canAfford}
              className={
                acceptOffer.submitting || !acceptOffer.canAfford
                  ? ""
                  : "cursor-pointer"
              }
              onClick={(e) => {
                e.preventDefault()
                void acceptOffer.submit()
              }}
            >
              {acceptOffer.submitting ? "Akceptuję..." : "Akceptuj"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}

export default OfferDetails
