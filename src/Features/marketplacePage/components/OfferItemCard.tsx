import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { Badge } from "@/shared/components/badge"
import type { offerListingItemDto } from "@/shared/types/offerTypes/OfferTypes"

const OfferItemCard = ({ item }: { item: offerListingItemDto }) => {
  return (
    <div className="flex h-full flex-col gap-2">
      <AspectRatio ratio={16 / 9} className="flex items-center justify-center">
        <img
          src={item.photoUrl}
          alt={item.name}
          className="w-full h-full object-cover cursor-pointer"
        />
      </AspectRatio>

      <div className="mt-2 flex flex-col gap-2">
        <p className="font-medium line-clamp-2 text-sm text-left min-h-[2.5rem]">
          {item.name}
        </p>
        <div className="flex items-center gap-2 text-xs">
          <Badge className="w-fit bg-white text-black rounded-full pl-0">
            {item.gameName}
          </Badge>
          <Badge className=" w-fit bg-gray-100 text-gray-900 rounded-full">
            {item.rarityName}
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default OfferItemCard
