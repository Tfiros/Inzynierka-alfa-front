import { Badge } from "@/components/ui/badge"
import type { OfferType } from "../offer"
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import OfferItemCard from "./OfferItemCard"
import { Button } from "@/componentsShared/button"
import { Plus } from "lucide-react"

type OfferDetailsProps = {
  offer: OfferType
  open: boolean
  onOpenChange: (open: boolean) => void
}

const OfferDetails = ({ offer, open, onOpenChange }: OfferDetailsProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-h-[80vh] overflow-y-auto sm:min-w-3xl">
        <DialogHeader className="flex flex-col sm:flex-row sm:justify-between mr-12">
          <div>
            <DialogTitle>{offer.title}</DialogTitle>
            <DialogDescription>Szczegóły oferty</DialogDescription>
          </div>

          <div className="flex w-full flex-col gap-2 mt-2 sm:w-auto sm:flex-row">
            <Button
              type="button"
              className="text-xs cursor-pointer w-full sm:w-auto"
            >
              Wymień
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-xs cursor-pointer w-full sm:w-auto"
            >
              <Plus /> Złóż kontrofertę
            </Button>
          </div>
        </DialogHeader>
        <div className="mt-4">
          <div className="pb-4">
            <Badge className="w-full md:w-fit bg-gray-100 text-gray-900 rounded-full">
              Mam
            </Badge>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {offer.itemsHave.map((item) => (
                <div
                  key={item.id}
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
              {offer.itemsWant.map((item) => (
                <div
                  key={item.id}
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
