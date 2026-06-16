import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { Badge } from "@/shared/components/badge"
import type { offerListingItemDto } from "@/shared/types/offerTypes/OfferTypes"

const OfferItemCard = ({
  listingItemDto,
}: {
  listingItemDto: offerListingItemDto
}) => {
  return (
    <div className="flex h-full flex-col gap-2">
      <AspectRatio ratio={16 / 9} className="flex items-center justify-center">
        <img
          src={listingItemDto.itemDto.photoUrl?.trim() || "/placeholder.webp"}
          alt={listingItemDto.itemDto.name}
          className="w-full h-full object-cover cursor-pointer"
        />
      </AspectRatio>

      <div className="mt-2 flex min-w-0 flex-col gap-2">
        <p className="min-h-[2.5rem] min-w-0 text-left text-sm font-medium line-clamp-2 break-words">
          {listingItemDto.quantity}x {listingItemDto.itemDto.name}
        </p>

        <div className="flex min-w-0 flex-wrap items-center gap-2 overflow-hidden text-xs">
          <Badge className="max-w-full truncate rounded-full bg-muted px-2.5 text-muted-foreground">
            {listingItemDto.itemDto.game.name}
          </Badge>

          <Badge className="max-w-full truncate rounded-full bg-muted px-2.5 text-muted-foreground">
            {listingItemDto.rarityName}
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default OfferItemCard
