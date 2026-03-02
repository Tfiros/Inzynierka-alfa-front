import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/card"
import { Badge } from "@/shared/components/badge"
import { Button } from "@/shared/components/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/alert-dialog"
import type { CounterOfferListItemDto } from "@/shared/types/counterOfferTypes/CounterOfferListItemDto"

type Props = {
  data: CounterOfferListItemDto
  variant: "sent" | "received"
  onOpenOffer?: (offerId: number) => void

  onAccept?: (counterOfferId: number) => void
  onCancel?: (counterOfferId: number) => void

  actionsDisabled?: boolean
}

const CounterOfferStatus = {
  Pending: 1,
  Accepted: 2,
  Denied: 3,
} as const

type CounterOfferStatusId =
  (typeof CounterOfferStatus)[keyof typeof CounterOfferStatus]

type BadgeVariant = "default" | "destructive" | "outline"

function isCounterOfferStatusId(v: number): v is CounterOfferStatusId {
  return v === 1 || v === 2 || v === 3
}

function statusVariant(statusId: number): BadgeVariant {
  if (!isCounterOfferStatusId(statusId)) return "outline"

  switch (statusId) {
    case CounterOfferStatus.Accepted:
      return "default"
    case CounterOfferStatus.Denied:
      return "destructive"
    default:
      return "outline"
  }
}
export default function CounterOfferCard({
  data,
  variant,
  onOpenOffer,
  onAccept,
  onCancel,
  actionsDisabled = false,
}: Props) {
  const itemsCount =
    data.items?.reduce((acc, x) => acc + (x.quantity ?? 0), 0) ?? 0

  const created = data.creationDate ? new Date(data.creationDate) : null

  const isPending = data.statusId === 1
  const showActions = variant === "received" && isPending

  return (
    <Card className="hover:shadow-sm transition">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base truncate">
              {data.offerTitle || `Oferta #${data.offerId}`}
            </CardTitle>

            <div className="mt-1 text-xs text-muted-foreground">
              {variant === "sent" ? (
                <>
                  Do:{" "}
                  <span className="font-medium">
                    {data.counterOfferUserNickname || "użytkownik"}
                  </span>
                </>
              ) : (
                <>
                  Od:{" "}
                  <span className="font-medium">
                    {data.counterOfferUserNickname || "użytkownik"}
                  </span>
                </>
              )}
              {created && <> • {created.toLocaleString()}</>}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant={statusVariant(data.statusId) as any}>
              {data.statusName}
            </Badge>

            <div className="text-sm">
              <span className="text-muted-foreground">Tokeny:</span>{" "}
              <span className="font-semibold">{data.tokensOffered}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div>
            Itemy:{" "}
            <span className="font-medium text-foreground">{itemsCount}</span>
          </div>
          <button
            type="button"
            className="text-xs underline underline-offset-4 hover:opacity-80"
            onClick={() => onOpenOffer?.(data.offerId)}
          >
            Otwórz ofertę
          </button>
        </div>

        {data.items?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.items.slice(0, 6).map((it) => (
              <div
                key={`${data.counterOfferId}-${it.itemId}`}
                className="flex items-center gap-2 rounded-md border p-2"
              >
                {it.itemPhotoUrl ? (
                  <img
                    src={it.itemPhotoUrl}
                    alt={it.itemName}
                    className="h-10 w-10 rounded object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-muted" />
                )}

                <div className="min-w-0">
                  <div className="text-sm truncate">{it.itemName}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {it.gameName} • x{it.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Brak itemów w kontrofercie.
          </div>
        )}

        {data.items?.length > 6 && (
          <div className="text-xs text-muted-foreground mt-2">
            +{data.items.length - 6} więcej…
          </div>
        )}

        {showActions && (
          <div className="mt-4 flex gap-2 justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={actionsDisabled}>
                  Anuluj
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Czy jesteś pewien?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ta akcja odrzuci kontrofertę (status: denied). Tego nie da
                    się cofnąć.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={actionsDisabled}>
                    Nie, wróć
                  </AlertDialogCancel>

                  <AlertDialogAction asChild>
                    <Button
                      variant="destructive"
                      disabled={actionsDisabled}
                      onClick={() => onCancel?.(data.counterOfferId)}
                    >
                      Tak, anuluj
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={actionsDisabled}
              onClick={() => onAccept?.(data.counterOfferId)}
            >
              Akceptuj
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
