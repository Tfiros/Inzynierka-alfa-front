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

      <div className="mt-2 flex flex-col gap-2">
        <p className="font-medium line-clamp-2 text-sm text-left min-h-[2.5rem]">
          {listingItemDto.quantity}x {listingItemDto.itemDto.name}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge className="inline-flex h-6 items-center justify-center rounded-full bg-white px-2.5 text-black leading-none">
            {listingItemDto.itemDto.game.name}
          </Badge>
          <Badge className="inline-flex h-6 items-center justify-center rounded-full bg-gray-100 px-2.5 text-gray-900 leading-none">
            {listingItemDto.rarityName}
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default OfferItemCard
