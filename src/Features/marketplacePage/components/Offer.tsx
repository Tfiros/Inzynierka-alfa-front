import { Badge } from "@/shared/components/badge"
import { Button } from "@/shared/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/card"
import {
  Heart,
  CalendarDays,
  Plus,
  Info,
  SquarePen,
  Trash2,
  Sparkles,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import OfferItemCard from "./OfferItemCard"
import type { offerListingDtoResponse } from "@/shared/types/offerTypes/RequestResponseTypes"
import { useAppStore } from "@/shared/store/appStore"
import { cn } from "@/shared/lib/Utils"
import OfferStatusPill from "./OfferStatusPill"
type OfferProps = {
  offer: offerListingDtoResponse
  onShowDetails: (offerId: number) => void
}

const Offer = ({ offer, onShowDetails }: OfferProps) => {
  const remainingOffered = offer.offeredItemsTotalCount - 3
  const remainingWanted = offer.wantedItemsTotalCount - 3
  const requestEdit = useAppStore((s) => s.offerRequestEdit)
  const requestDelete = useAppStore((s) => s.offerRequestDelete)
  const successRate = new Intl.NumberFormat("pl-PL", {
    style: "percent",
  }).format(offer.offerUserDto.successRate)
  const currentUserId = useAppStore((s) => s.userId)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const isOwner = isAuthenticated && currentUserId === offer.offerUserDto.userId
  const isActive = offer.offerCoreDto.offerStatusId === 1
  return (
    <Card
      className={cn(
        "h-full flex flex-col",
        offer.offerCoreDto.isHighlighted &&
          "border-2 border-yellow-400/70 bg-yellow-50/30 shadow-[0_0_0_3px_rgba(250,204,21,0.15)]",
        !isActive && "opacity-60"
      )}
    >
      <CardHeader>
        <CardTitle className="w-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-base font-semibold lg:text-lg text-left line-clamp-2 min-h-[3.5rem] flex flex-row gap-2">
              {offer.offerCoreDto.isHighlighted && (
                <Sparkles className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              )}
              {offer.offerCoreDto.title}
            </h1>

            <div className="flex flex-row items-center gap-3">
              {!isActive && (
                <OfferStatusPill
                  offerStatusId={offer.offerCoreDto.offerStatusId}
                />
              )}
              <div className="flex flex-row items-center text-xs text-muted-foreground">
                <CalendarDays className="w-5 h-5" />
                <span className="pl-2">{offer.offerCoreDto.expDate}</span>
              </div>
              <Button
                variant="outline"
                className="cursor-pointer group"
                type="button"
              >
                <Heart className="group-hover:text-red-500 group-hover:fill-red-500 transition" />
              </Button>
              {offer.offerCoreDto.isHighlighted && (
                <Badge className="bg-yellow-400/20 text-yellow-900 border border-yellow-400/40">
                  Wyróżniony
                </Badge>
              )}
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-6">
        <div className="grid md:grid-cols-2 gap-3 min-h-[260px]">
          <div className="flex flex-col w-full gap-2">
            <Badge className="w-fit bg-gray-100 text-gray-900 rounded-full">
              Mam
            </Badge>
            {offer.offeredItems.map((listingItemDto) => (
              <div
                key={listingItemDto.itemDto.id}
                className="w-full max-w-[260px]"
              >
                <OfferItemCard listingItemDto={listingItemDto} />
              </div>
            ))}
            {remainingOffered > 0 && (
              <p className="text-sm text-muted-foreground">
                i {remainingOffered} dodatkowych przedmiotów
              </p>
            )}
          </div>

          <div className="flex flex-col w-full gap-2 border-t pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-4 border-gray-300">
            <Badge className="w-fit rounded-full">Chcę</Badge>
            {offer.wantedItems.map((listingItemDto) => (
              <div
                key={listingItemDto.itemDto.id}
                className="w-full max-w-[260px]"
              >
                <OfferItemCard listingItemDto={listingItemDto} />
              </div>
            ))}
            {remainingWanted > 0 && (
              <p className="text-sm text-muted-foreground">
                i {remainingWanted} dodatkowych przedmiotów
              </p>
            )}
          </div>
        </div>

        <p className="text-gray-500 text-left line-clamp-3 min-h-[4.5rem]">
          {offer.offerCoreDto.description}
        </p>
      </CardContent>

      <CardFooter className="mt-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
        <div className="flex flex-row  items-center">
          <Avatar>
            <AvatarImage
              src={
                offer.offerUserDto.imageUrl ?? "https://github.com/shadcn.png"
              }
              alt={offer.offerUserDto.nickname}
            />
            <AvatarFallback>
              {offer.offerUserDto.nickname.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start pl-4">
            <span className="font-medium text-foreground">
              {offer.offerUserDto.nickname}
            </span>
            <span className="">
              {offer.offerUserDto.rating}/5 ★ •{" "}
              {offer.offerUserDto.successTradesCount} wymian • {successRate} SR
            </span>
            <span className=""></span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="text-xs cursor-pointer w-full sm:w-auto"
            onClick={() => onShowDetails(offer.offerCoreDto.offerId)}
          >
            <Info /> Szczegóły
          </Button>
          {isOwner ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="text-xs cursor-pointer w-full sm:w-auto"
                onClick={() => requestEdit(offer.offerCoreDto.offerId)}
                disabled={!isActive || !requestEdit || !isOwner}
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
      </CardFooter>
    </Card>
  )
}

export default Offer
