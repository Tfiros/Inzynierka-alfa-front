import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { OfferType } from '../offer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import { Heart, CalendarDays, Plus } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
const Offer = ({ offer }: { offer: OfferType }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="w-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-base font-semibold lg:text-lg">
              {offer.title}
            </h1>

            <div className="flex flex-row items-center gap-3">
              <div className="flex flex-row items-center text-xs text-muted-foreground">
                <CalendarDays className="w-5 h-5" />
                <span className="pl-2">{offer.date}</span>
              </div>
              <Button variant="outline" className="cursor-pointer group">
                <Heart className="group-hover:text-red-500 group-hover:fill-red-500 transition" />
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex flex-col w-full gap-2">
            <Badge className="w-fit bg-gray-100 text-gray-900 rounded-full">
              Mam
            </Badge>
            <AspectRatio
              ratio={16 / 9}
              className="flex items-center justify-center"
            >
              <img src="offer.svg?url" className="w-full h-full object-cover" />
            </AspectRatio>
            <div className="mt-2 flex flex-row items-center justify-between gap-2">
              <p className="font-medium truncate">AK-47 Redline</p>
              <div className="flex items-center gap-2">
                <Badge className="w-fit bg-white text-black rounded-full">
                  {offer.itemsHave[0].game}
                </Badge>
                <Badge className=" w-fit bg-gray-100 text-gray-900 rounded-full">
                  {offer.itemsHave[0].rarity}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full gap-2 border-t pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-4 border-gray-300">
            <Badge className="mb-2 w-fit rounded-full">Chcę</Badge>
            <AspectRatio
              ratio={16 / 9}
              className="flex items-center justify-center"
            >
              <img src="offer.svg?url" className="w-full h-full object-cover" />
            </AspectRatio>
            <div className="mt-2 flex flex-row items-center justify-between gap-2">
              <p className="font-medium truncate">AK-47 Redline</p>
              <div className="flex items-center gap-2">
                <Badge className="w-fit bg-white text-black rounded-full">
                  {offer.itemsWant[0].game}
                </Badge>
                <Badge className=" w-fit bg-gray-100 text-gray-900 rounded-full">
                  {offer.itemsWant[0].rarity}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-start pt-8 flex-col gap-6">
          <p className="text-gray-500 text-left">{offer.description}</p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
            <div className="flex flex-row  items-center">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
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
                className="text-xs cursor-pointer w-full sm:w-auto"
              >
                Wymień
              </Button>
              <Button
                type="button"
                variant="outline"
                className="text-xs cursor-pointer w-full sm:w-auto"
              >
                <Plus /> Zloz kontroferte
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Offer
