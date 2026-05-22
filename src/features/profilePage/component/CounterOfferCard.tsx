import { useState } from "react"
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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/alert-dialog"
import type { CounterOfferListItemDto } from "@/shared/types/counterOfferTypes/CounterOfferListItemDto"
import { CounterOfferStatus } from "@/shared/enums/counterOfferStatus"

type Props = {
  data: CounterOfferListItemDto
  variant: "sent" | "received"
  onOpenOffer?: (offerId: number) => void

  onAccept?: (counterOfferId: number) => void | Promise<void>
  onDeny?: (counterOfferId: number) => void | Promise<void>
  onCancel?: (counterOfferId: number) => void | Promise<void>

  actionsDisabled?: boolean
}

type BadgeVariant = "default" | "secondary" | "destructive"

function isCounterOfferStatusId(v: number): v is CounterOfferStatus {
  return (
    v === CounterOfferStatus.Pending ||
    v === CounterOfferStatus.Accepted ||
    v === CounterOfferStatus.Denied
  )
}

function statusVariant(statusId: number): BadgeVariant {
  if (!isCounterOfferStatusId(statusId)) return "secondary"

  switch (statusId) {
    case CounterOfferStatus.Pending:
      return "default"
    case CounterOfferStatus.Accepted:
      return "secondary"
    case CounterOfferStatus.Denied:
      return "destructive"
  }
}

export default function CounterOfferCard({
  data,
  variant,
  onOpenOffer,
  onAccept,
  onDeny,
  onCancel,
  actionsDisabled = false,
}: Props) {
  const [accepting, setAccepting] = useState(false)
  const [denying, setDenying] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const itemsCount = data.items.reduce((acc, x) => acc + x.quantity, 0)

  const created = data.creationDate

  const isPending = data.statusId === CounterOfferStatus.Pending

  const anyLoading = accepting || denying || cancelling
  const disabled = actionsDisabled || anyLoading

  const handleAccept = async () => {
    if (!onAccept) return
    setAccepting(true)
    try {
      await onAccept(data.counterOfferId)
    } finally {
      setAccepting(false)
    }
  }

  const handleDeny = async () => {
    if (!onDeny) return
    setDenying(true)
    try {
      await onDeny(data.counterOfferId)
    } finally {
      setDenying(false)
    }
  }

  const handleCancel = async () => {
    if (!onCancel) return
    setCancelling(true)
    try {
      await onCancel(data.counterOfferId)
    } finally {
      setCancelling(false)
    }
  }

  return (
    <Card className="hover:shadow-sm transition">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base truncate">
              {data.offerTitle}
            </CardTitle>

            <div className="mt-1 text-xs text-muted-foreground">
              <div>
                {variant === "sent" ? "Do" : "Od"}:
                <span className="ml-1 font-medium">
                  {data.otherPartyNickname}
                </span>
              </div>
              {created && <> • {created.toLocaleString()}</>}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant={statusVariant(data.statusId)}>
              {data.statusName.charAt(0).toUpperCase() +
                data.statusName.slice(1)}
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

          {onOpenOffer && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenOffer(data.offerId)}
            >
              Otwórz ofertę
            </Button>
          )}
        </div>

        {data.items.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.items.slice(0, 3).map((it) => (
              <div
                key={`${data.counterOfferId}-${it.itemId}`}
                className="flex items-center gap-2 rounded-md border p-2"
              >
                {it.photoUrl ? (
                  <img
                    src={it.photoUrl}
                    alt={it.name}
                    className="h-10 w-10 rounded object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-muted" />
                )}

                <div className="min-w-0">
                  <div className="text-sm truncate">{it.name}</div>
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

        {data.items.length > 3 && (
          <div className="text-xs text-muted-foreground mt-2">
            +{data.items.length - 3} więcej…
          </div>
        )}

        <div className="mt-4 flex gap-2 justify-end">
          {variant === "received" && isPending ? (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={disabled}>
                    Odrzuć
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Odrzucić kontrofertę?</AlertDialogTitle>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={disabled}>
                      Wróć
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                      <Button
                        variant="destructive"
                        disabled={disabled}
                        onClick={async (e) => {
                          e.preventDefault()
                          await handleDeny()
                        }}
                      >
                        {denying ? "Odrzucam..." : "Tak, odrzuć"}
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={disabled}
                  >
                    Akceptuj
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Akceptować kontrofertę?</AlertDialogTitle>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={disabled}>
                      Wróć
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={disabled}
                        onClick={async (e) => {
                          e.preventDefault()
                          await handleAccept()
                        }}
                      >
                        {accepting ? "Akceptuję..." : "Tak, akceptuj"}
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : variant === "sent" && isPending ? (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={disabled}>
                    Anuluj
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Anulować kontrofertę?</AlertDialogTitle>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel
                      disabled={disabled || accepting || denying || cancelling}
                    >
                      Wróć
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                      <Button
                        variant="destructive"
                        disabled={
                          disabled || accepting || denying || cancelling
                        }
                        onClick={async (e) => {
                          e.preventDefault()
                          await handleCancel()
                        }}
                      >
                        {cancelling ? "Anuluję..." : "Tak, anuluj"}
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
