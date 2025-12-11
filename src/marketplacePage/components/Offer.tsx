import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { OfferType } from '../offer'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Heart, CalendarDays, Plus, Info } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import OfferItemCard from './OfferItemCard'
const MAX_VISIBLE_ITEMS = 2

type OfferProps = {
  offer: OfferType
  onShowDetails: (offer: OfferType) => void
}

const Offer = ({ offer, onShowDetails }: OfferProps) => {
  const visibleHave = offer.itemsHave.slice(0, MAX_VISIBLE_ITEMS)
  const visibleWant = offer.itemsWant.slice(0, MAX_VISIBLE_ITEMS)
  const remainingHave = offer.itemsHave.length - visibleHave.length
  const remainingWant = offer.itemsWant.length - visibleWant.length
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="w-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-base font-semibold lg:text-lg text-left line-clamp-2 min-h-[3.5rem]">
              {offer.title}
            </h1>

            <div className="flex flex-row items-center gap-3">
              <div className="flex flex-row items-center text-xs text-muted-foreground">
                <CalendarDays className="w-5 h-5" />
                <span className="pl-2">{offer.date}</span>
              </div>
              <Button
                variant="outline"
                className="cursor-pointer group"
                type="button"
              >
                <Heart className="group-hover:text-red-500 group-hover:fill-red-500 transition" />
              </Button>
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
            {visibleHave.map((item) => (
              <div key={item.id} className="w-full max-w-[260px]">
                <OfferItemCard item={item} />
              </div>
            ))}
            {remainingHave > 0 && (
              <p className="text-sm text-muted-foreground">
                i {remainingHave} dodatkowych przedmiotów
              </p>
            )}
          </div>

          <div className="flex flex-col w-full gap-2 border-t pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-4 border-gray-300">
            <Badge className="w-fit rounded-full">Chcę</Badge>
            {visibleWant.map((item) => (
              <div key={item.id} className="w-full max-w-[260px]">
                <OfferItemCard item={item} />
              </div>
            ))}
            {remainingWant > 0 && (
              <p className="text-sm text-muted-foreground">
                i {remainingWant} dodatkowych przedmiotów
              </p>
            )}
          </div>
        </div>

        <p className="text-gray-500 text-left line-clamp-3 min-h-[4.5rem]">
          {offer.description}
        </p>
      </CardContent>

      <CardFooter className="mt-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
        <div className="flex flex-row  items-center">
          <Avatar>
            <AvatarImage
              src={offer.user.avatarUrl ?? 'https://github.com/shadcn.png'}
              alt={offer.user.username}
            />
            <AvatarFallback>
              {offer.user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start pl-4">
            <span className="font-medium text-foreground">
              {offer.user.username}
            </span>
            <span className="">
              {offer.user.rating}/5 ★ • {offer.user.tradesCount} wymian
            </span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="text-xs cursor-pointer w-full sm:w-auto"
            onClick={() => onShowDetails(offer)}
          >
            <Info /> Szczegóły
          </Button>
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
      </CardFooter>
    </Card>
  )
}

export default Offer
