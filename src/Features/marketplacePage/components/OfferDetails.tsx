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
import { useAppStore } from "@/shared/store/AppStore"

type OfferDetailsProps = {
  offer: offerDetailsDtoResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (offerId: number) => void
  onDelete?: (offerId: number) => void
  onTrade?: (offerId: number) => void
  onCounterOffer?: (offerId: number) => void
}

const OfferDetails = ({
  offer,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onTrade,
  onCounterOffer,
}: OfferDetailsProps) => {
  const currentUserId = useAppStore((s) => s.userId)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const isOwner = isAuthenticated && currentUserId === offer.offerUserDto.userId
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-h-[80vh] overflow-y-auto sm:min-w-3xl">
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
                  onClick={() => onEdit?.(offer.offerCoreDto.offerId)}
                  disabled={!onEdit || !isOwner}
                >
                  <SquarePen className="mr-1 h-4 w-4" /> Edytuj
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="text-xs cursor-pointer w-full sm:w-auto"
                  onClick={() => onDelete?.(offer.offerCoreDto.offerId)}
                  disabled={!onDelete || !isOwner}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Usuń
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  className="text-xs cursor-pointer w-full sm:w-auto"
                  onClick={() => onTrade?.(offer.offerCoreDto.offerId)}
                  disabled={!onTrade || isOwner}
                >
                  Wymień
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs cursor-pointer w-full sm:w-auto"
                  onClick={() => onCounterOffer?.(offer.offerCoreDto.offerId)}
                  disabled={!onCounterOffer || isOwner}
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
              {offer.offeredItems.map((item) => (
                <div
                  key={item.itemId}
                  className="h-full rounded-lg border border-gray-100 p-4 shadow-sm"
                >
                  <OfferItemCard item={item} />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <Badge className="w-full md:w-fit rounded-full">Chcę</Badge>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {offer.wantedItems.map((item) => (
                <div
                  key={item.itemId}
                  className="h-full rounded-lg border border-gray-100 p-4 shadow-sm"
                >
                  <OfferItemCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OfferDetails
