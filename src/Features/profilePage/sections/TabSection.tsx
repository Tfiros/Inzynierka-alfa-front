import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/shared/components/Card"
import React, { useMemo } from "react"
import { CalendarDays, SquarePen, History, Edit, Images } from "lucide-react"
import { Button } from "@/shared/components/Button"
import { Badge } from "@/shared/components/Badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/Tabs"

const cx = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ")

const Tag = ({ label }: { label: string }) => (
  <Badge variant="outline" className="text-xs font-normal">
    {label}
  </Badge>
)

type Offer = {
  id: string
  titleLeft: string
  titleRight: string
  haveLabel?: string
  wantLabel?: string
  systemTags?: string[]
  views: number
  interested: number
  date: string
  endDate: string
  status: "Aktywna" | "Wymieniona"
}

const MOCK_OFFERS: Offer[] = [
  {
    id: "1",
    titleLeft: "AK-47 Redline",
    titleRight: "Holographic Charizard + inne karty",
    haveLabel: "Mam",
    wantLabel: "Chcę",
    systemTags: ["CS2", "Classified", "Pokémon TCG", "Holographic"],
    views: 24,
    interested: 3,
    date: "2024-01-15",
    endDate: "",
    status: "Aktywna",
  },
  {
    id: "2",
    titleLeft: "Konto Fortnite (500+ skinów)",
    titleRight: "Zestaw skinów CS2",
    haveLabel: "Mam",
    wantLabel: "Chcę",
    systemTags: ["Fortnite", "Legendary", "CS2", "Mixed"],
    views: 156,
    interested: 8,
    date: "2024-01-12",
    endDate: "",
    status: "Aktywna",
  },
  {
    id: "3",
    titleLeft: "Black Lotus",
    titleRight: "Armia Space Marines",
    haveLabel: "Mam",
    wantLabel: "Chcę",
    systemTags: [
      "Magic: The Gathering",
      "Mythic Rare",
      "Warhammer 40k",
      "Premium",
    ],
    views: 89,
    interested: 12,
    date: "2024-01-10",
    endDate: "2024-01-20",
    status: "Wymieniona",
  },
]

function OfferCard({
  offer,
}: {
  offer: Offer
  onMarkExchanged?: (id: string) => void
}) {
  const isExchanged = offer.status === "Wymieniona"

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <StatusPill status={offer.status} />
          {offer.haveLabel && <Chip>{offer.haveLabel}</Chip>}
          {offer.wantLabel && <Chip>{offer.wantLabel}</Chip>}
        </div>
        {!isExchanged && (
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            title="Edytuj"
          >
            <SquarePen className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <GhostThumb />
          <GhostThumb />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="font-medium line-clamp-1">{offer.titleLeft}</div>
          <div className="font-medium line-clamp-1">{offer.titleRight}</div>
        </div>
        <div className="flex flex-wrap gap-1">
          {offer.systemTags?.slice(0, 6).map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            Data wystawienia oferty: {offer.date}
          </span>
        </div>

        {isExchanged && offer.endDate && (
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              Data wymiany: {offer.endDate}
            </span>
          </div>
        )}

        {isExchanged ? (
          <div className="w-full rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground flex items-center justify-center">
            <span className="inline-flex items-center gap-2">
              <History className="h-3.5 w-3.5" /> Wymiana zakończona
            </span>
          </div>
        ) : (
          <div className="flex w-full items-center justify-end gap-2">
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-1" /> Edytuj
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

function StatusPill({ status }: { status: Offer["status"] }) {
  const map: Record<Offer["status"], string> = {
    Aktywna: "bg-emerald-100 text-emerald-700",
    Wymieniona: "bg-slate-900 text-white",
  }
  return (
    <span
      className={cx(
        "px-2 py-0.5 rounded-full text-xs font-medium",
        map[status]
      )}
    >
      {status}
    </span>
  )
}
const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
    {children}
  </span>
)
const GhostThumb = () => (
  <div className="aspect-[4/3] rounded-lg border bg-muted/40 grid place-items-center">
    <Images className="h-5 w-5 opacity-50" />
  </div>
)

export const TabSection = () => {
  const [offers, setOffers] = React.useState<Offer[]>(MOCK_OFFERS)

  const activeOffers = React.useMemo(
    () => offers.filter((o) => o.status === "Aktywna"),
    [offers]
  )
  const exchangedOffers = React.useMemo(
    () => offers.filter((o) => o.status === "Wymieniona"),
    [offers]
  )
  const markAsExchanged = (id: string) =>
    setOffers((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: "Wymieniona",
              endDate: new Date().toISOString().slice(0, 10),
            }
          : o
      )
    )

  return (
    <section>
      <Tabs defaultValue="offers" className="mt-6">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="offers">Moje wystawione oferty</TabsTrigger>
          <TabsTrigger value="history">Historia wymian</TabsTrigger>
        </TabsList>

        <TabsContent value="offers" className="mt-4">
          <div className="text-sm text-muted-foreground mb-3">
            Oferty wymian, które obecnie masz wystawione na platformie
          </div>
          {activeOffers.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Brak aktywnych ofert.
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {activeOffers.map((o) => (
                <OfferCard
                  key={o.id}
                  offer={o}
                  onMarkExchanged={markAsExchanged}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {exchangedOffers.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Brak zakończonych wymian.
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {exchangedOffers.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  )
}
