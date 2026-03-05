import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

import SectionTitle from "../components/SectionTitle"
import SearchSuggest from "../components/SearchSuggest"

import { Button } from "@/shared/components/button"
import { DialogHeader, DialogTitle } from "@/shared/components/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/alert-dialog"

import { useItemSuggestions } from "../hooks/UseItemSuggestions"
import type { OfferInformationDTO } from "@/shared/types/offerTypes/RequestResponseTypes"
import type { CounterOfferDraftRequest } from "@/shared/types/counterOfferTypes/RequestResponseTypes"
import { CounterOfferService } from "@/shared/api/services/CounterOfferService"

type PickedItem = {
  itemId: number
  name: string
  gameName?: string
  quantity: number
}

type Props = {
  offerId: number | null
  onCancel: () => void

  baseOffer: OfferInformationDTO | null
  baseOfferLoading: boolean
  baseOfferError: string | null
}

export default function CreateCounterOfferModalContent({
  offerId,
  onCancel,
  baseOffer,
  baseOfferLoading,
  baseOfferError,
}: Props) {
  const [opened, setOpened] = useState(false)
  const suggestions = useItemSuggestions()

  const [items, setItems] = useState<PickedItem[]>([])
  const [tokens, setTokens] = useState(0)

  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (submitError) setSubmitError(null)
  }, [tokens, items.length])

  const addItem = (item: any) => {
    const itemId = item.id ?? item.itemId ?? item.ID
    const name = item.name ?? item.Name
    const gameName = item.gameName ?? item.game?.name ?? item.GameName

    if (!itemId || !name) return

    setItems((previousItems) => {
      if (previousItems.some((x) => x.itemId === itemId)) return previousItems
      return [...previousItems, { itemId, name, gameName, quantity: 1 }]
    })
  }

  const setQuantity = (itemId: number, quantity: number) => {
    const safe = Number.isFinite(quantity) ? Math.max(1, quantity) : 1
    setItems((previousItems) =>
      previousItems.map((x) =>
        x.itemId === itemId ? { ...x, quantity: safe } : x
      )
    )
  }

  const removeOne = (itemId: number) =>
    setItems((previousItems) =>
      previousItems.filter((x) => x.itemId !== itemId)
    )

  const removeAll = () => setItems([])

  const canConfirm =
    (items.length > 0 || tokens > 0) && tokens >= 0 && !submitting

  return (
    <>
      <DialogHeader className="flex flex-col items-center gap-y-2">
        <DialogTitle className="text-lg font-semibold">
          Złóż propozycję kontroferty
        </DialogTitle>
      </DialogHeader>

      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
        <div className="mt-4 rounded-xl border p-3 bg-muted/30">
          {baseOfferLoading && (
            <p className="text-sm text-muted-foreground">Ładowanie oferty</p>
          )}

          {!baseOfferLoading && baseOfferError && (
            <p className="text-sm text-red-500">{baseOfferError}</p>
          )}

          {!baseOfferLoading && !baseOfferError && baseOffer && (
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                Koszt oferty:{" "}
                <span className="font-medium text-foreground">
                  {baseOffer.tokenCost}
                </span>
              </div>

              <div className="text-xs text-muted-foreground">
                Przedmioty posiadane:
              </div>

              <div className="space-y-2">
                {(() => {
                  const offered = (baseOffer as any).offeredItems
                  if (Array.isArray(offered)) return offered

                  const items = (baseOffer as any).items ?? []
                  return (items as any[]).filter((x) => {
                    const flag = x?.isWanted ?? x?.is_wanted
                    return flag === false
                  })
                })().map((x: any) => {
                  const id = x?.itemDto?.id ?? x?.itemId ?? x?.item_id ?? x?.id
                  const name =
                    x?.itemDto?.name ??
                    x?.name ??
                    x?.item?.name ??
                    `Item #${id ?? "?"}`
                  const game =
                    x?.itemDto?.game?.name ?? x?.gameName ?? x?.game?.name
                  const qty = x?.quantity ?? 1

                  return (
                    <div
                      key={x?.id ?? id ?? name}
                      className="flex items-center justify-between rounded-lg border bg-background px-3 py-2"
                    >
                      <div className="flex flex-col">
                        <div className="text-sm font-medium">{name}</div>
                        {game && (
                          <div className="text-xs text-muted-foreground">
                            {game}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        x{qty}
                      </div>
                    </div>
                  )
                })}

                {(() => {
                  const offered = (baseOffer as any).offeredItems
                  if (Array.isArray(offered)) return offered.length === 0

                  const items = (baseOffer as any).items ?? []
                  const mam = (items as any[]).filter(
                    (x) => (x?.isWanted ?? x?.is_wanted) === false
                  )
                  return mam.length === 0
                })() && (
                  <div className="text-sm text-muted-foreground">
                    Brak przedmiotów
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="py-10">
          <SectionTitle>Co oferujesz?</SectionTitle>

          <SearchSuggest
            value={suggestions.query}
            onChange={suggestions.setQuery}
            suggestions={suggestions.suggestions}
            loading={suggestions.loading}
            error={suggestions.error}
            onPickSuggestion={(item) => {
              addItem(item)
              suggestions.setQuery("")
            }}
            disabled={false}
          />

          <div className="mt-4 space-y-2">
            {items.map((it) => (
              <div
                key={it.itemId}
                className="flex items-center justify-between rounded-xl border p-3"
              >
                <div className="flex flex-col">
                  <div className="font-medium">{it.name}</div>
                  {it.gameName && (
                    <div className="text-xs text-muted-foreground">
                      {it.gameName}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    className="h-9 w-20 rounded-md border px-2"
                    value={it.quantity}
                    onChange={(e) =>
                      setQuantity(it.itemId, Number(e.target.value))
                    }
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeOne(it.itemId)}
                  >
                    Usuń
                  </Button>
                </div>
              </div>
            ))}

            {items.length > 0 && (
              <Button variant="outline" onClick={removeAll}>
                Usuń wszystko
              </Button>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <SectionTitle>Tokeny</SectionTitle>

          <input
            type="number"
            min={0}
            className="mt-3 h-10 w-full rounded-xl border px-3"
            value={tokens}
            onChange={(e) => setTokens(Number(e.target.value))}
          />
        </div>

        <div className="mt-10 border-t pt-4 flex items-center gap-3">
          <Button
            className="h-10 flex-1 rounded-xl text-base font-semibold bg-black text-white border-black"
            disabled={!canConfirm}
            onClick={() => setOpened(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Złóż kontrofertę
          </Button>

          <Button
            variant="outline"
            className="h-10 rounded-xl px-8 text-base"
            onClick={onCancel}
            disabled={submitting}
          >
            Anuluj
          </Button>
        </div>
      </div>

      <AlertDialog open={opened} onOpenChange={setOpened}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potwierdź wysłanie kontroferty</AlertDialogTitle>
          </AlertDialogHeader>

          {submitError && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Wróć</AlertDialogCancel>
            <AlertDialogAction
              disabled={submitting}
              onClick={async (e) => {
                e.preventDefault()

                if (!offerId) return

                const extractMsg = (x: any): string => {
                  const msg =
                    x?.message ??
                    x?.data?.message ??
                    x?.response?.data?.message ??
                    x?.error?.message ??
                    ""

                  return typeof msg === "string" ? msg : ""
                }

                const isNotEnoughTokens = (msg: string) => {
                  const m = msg.toLowerCase()
                  return (
                    m.includes("token") &&
                    (m.includes("za mało") ||
                      m.includes("brak") ||
                      m.includes("niewystarcz"))
                  )
                }

                setSubmitting(true)
                setSubmitError(null)

                const request: CounterOfferDraftRequest = {
                  tokensOffered: tokens,
                  items: items.map((i) => ({
                    itemId: i.itemId,
                    quantity: i.quantity,
                  })),
                }

                try {
                  const res = await CounterOfferService.create(offerId, request)

                  if (!res.isSuccess) {
                    const msg = extractMsg(res)

                    if (isNotEnoughTokens(msg)) {
                      setSubmitError(
                        "Masz za mało tokenów, aby wysłać tę kontrofertę."
                      )
                      setSubmitError(msg)
                    } else {
                      setSubmitError(
                        "Nie udało się wysłać kontroferty. Spróbuj ponownie."
                      )
                    }

                    return
                  }

                  setOpened(false)
                  onCancel()
                } catch (err: any) {
                  const msg = extractMsg(err)

                  if (isNotEnoughTokens(msg)) {
                    setSubmitError(
                      "Masz za mało tokenów, aby wysłać tę kontrofertę."
                    )
                  } else if (msg) {
                    setSubmitError(msg)
                  } else {
                    setSubmitError(
                      "Nie udało się wysłać kontroferty. Spróbuj ponownie."
                    )
                  }
                } finally {
                  setSubmitting(false)
                }
              }}
            >
              Wyślij
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
