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
import { cn } from "@/shared/lib/Utils"
import PointsIcon from "@/shared/photos/PointsIcon.svg"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip"
import { useCounterOfferModal } from "../hooks/UseCounterOfferModal"
import CreateCounterOfferModalContent from "@/shared/views/OfferInteractionView/views/CreateCounterOfferModalContent"

type OfferDetailsProps = {
  offer: offerDetailsDtoResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

const OfferDetails = ({ offer, open, onOpenChange }: OfferDetailsProps) => {
  const currentUserId = useAppStore((s) => s.userId)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const requestEdit = useAppStore((s) => s.offerRequestEdit)

  const requestDelete = useAppStore((s) => s.offerRequestDelete)

  const counter = useCounterOfferModal()

  const isOwner = isAuthenticated && currentUserId === offer.offerUserDto.userId
  const isActive = offer.offerCoreDto.offerStatusId === 1
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
                  onClick={() => requestEdit(offer.offerCoreDto.offerId)}
                  disabled={!isActive || !isOwner}
                >
                  <SquarePen className="mr-1 h-4 w-4" /> Edytuj
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="text-xs cursor-pointer w-full sm:w-auto"
                  onClick={() => requestDelete(offer.offerCoreDto.offerId)}
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
                  onClick={() => console.log(offer.offerCoreDto.offerId)}
                  disabled={!isActive || isOwner}
                >
                  Wymień
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs cursor-pointer w-full sm:w-auto"
                  onClick={() => console.log(offer.offerCoreDto.offerId)}
                  disabled={!isActive || isOwner}
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
        </DialogContent>
      </Dialog>
      <Dialog open={counter.open} onOpenChange={counter.onOpenChange}>
        <DialogContent className="max-w-3xl">
          <CreateCounterOfferModalContent
            offerId={counter.offerId}
            baseOffer={counter.baseOffer}
            baseOfferLoading={counter.baseOfferLoading}
            baseOfferError={counter.baseOfferError}
            onCancel={() => {
              counter.close()
              onOpenChange(true)
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default OfferDetails
