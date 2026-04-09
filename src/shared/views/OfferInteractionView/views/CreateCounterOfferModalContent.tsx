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
import type { offerDetailsDtoResponse } from "@/shared/types/offerTypes/RequestResponseTypes"
import type { CounterOfferDraftRequest } from "@/shared/types/counterOfferTypes/RequestResponseTypes"
import { CounterOfferService } from "@/shared/api/services/CounterOfferService"
import { useAppStore } from "@/shared/store/appStore"

type PickedItem = {
  itemId: number
  name: string
  gameName?: string
  quantity: number
}

type Props = {
  offerId: number | null
  onCancel: () => void
  baseOffer: offerDetailsDtoResponse | null
  baseOfferLoading: boolean
  baseOfferError: string | null
}

type SuggestionItem = {
  id?: number
  itemId?: number
  ID?: number
  name?: string
  Name?: string
  gameName?: string
  GameName?: string
  game?: {
    name?: string
  }
}

type ErrorLike = {
  message?: unknown
  data?: {
    message?: unknown
  }
  response?: {
    data?: {
      message?: unknown
    }
  }
  error?: {
    message?: unknown
  }
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
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)

  const [items, setItems] = useState<PickedItem[]>([])
  const [tokens, setTokens] = useState(0)

  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setSubmitError(null)
  }, [tokens, items.length])

  const addItem = (item: SuggestionItem) => {
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

  const extractMsg = (x: unknown): string => {
    if (!x || typeof x !== "object") {
      return ""
    }

    const obj = x as {
      message?: unknown
      data?: unknown
      response?: {
        data?: {
          message?: unknown
        }
      }
      error?: {
        message?: unknown
      }
    }

    if (typeof obj.message === "string") {
      return obj.message
    }

    if (
      obj.data &&
      typeof obj.data === "object" &&
      "message" in obj.data &&
      typeof (obj.data as { message?: unknown }).message === "string"
    ) {
      return (obj.data as { message: string }).message
    }

    if (typeof obj.response?.data?.message === "string") {
      return obj.response.data.message
    }

    if (typeof obj.error?.message === "string") {
      return obj.error.message
    }

    return ""
  }

  const isNotEnoughTokens = (msg: string) => {
    const m = msg.toLowerCase()
    return (
      m.includes("token") &&
      (m.includes("za mało") || m.includes("brak") || m.includes("niewystarcz"))
    )
  }

  const handleSubmit = async () => {
    if (!offerId) return

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
          setSubmitError("Masz za mało tokenów, aby wysłać tę kontrofertę.")
        } else if (msg) {
          setSubmitError(msg)
        } else {
          setSubmitError("Nie udało się wysłać kontroferty. Spróbuj ponownie.")
        }

        return
      }

      await refreshNavbar()
      setOpened(false)
      onCancel()
    } catch (err: unknown) {
      const msg = extractMsg(err)

      if (isNotEnoughTokens(msg)) {
        setSubmitError("Masz za mało tokenów, aby wysłać tę kontrofertę.")
      } else if (msg) {
        setSubmitError(msg)
      } else {
        setSubmitError("Nie udało się wysłać kontroferty. Spróbuj ponownie.")
      }
    } finally {
      setSubmitting(false)
    }
  }

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
                Tytuł oferty:{" "}
                <span className="font-medium text-foreground">
                  {baseOffer.offerCoreDto.title}
                </span>
              </div>

              <div className="text-sm text-muted-foreground">
                Opis:{" "}
                <span className="font-medium text-foreground">
                  {baseOffer.offerCoreDto.description}
                </span>
              </div>

              <div className="text-xs text-muted-foreground">
                Przedmioty posiadane:
              </div>

              <div className="space-y-2">
                {baseOffer.offeredItems.map((x) => (
                  <div
                    key={x.itemDto.id}
                    className="flex items-center justify-between rounded-lg border bg-background px-3 py-2"
                  >
                    <div className="flex flex-col">
                      <div className="text-sm font-medium">
                        {x.itemDto.name}
                      </div>
                      {x.itemDto.game?.name && (
                        <div className="text-xs text-muted-foreground">
                          {x.itemDto.game.name}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      x{x.quantity}
                    </div>
                  </div>
                ))}

                {baseOffer.offeredItems.length === 0 && (
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
            disabled={submitting}
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
                    disabled={submitting}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeOne(it.itemId)}
                    disabled={submitting}
                  >
                    Usuń
                  </Button>
                </div>
              </div>
            ))}

            {items.length > 0 && (
              <Button
                variant="outline"
                onClick={removeAll}
                disabled={submitting}
              >
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
            onChange={(e) =>
              setTokens(Math.max(0, Number(e.target.value) || 0))
            }
            disabled={submitting}
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
              onClick={(e) => {
                e.preventDefault()
                void handleSubmit()
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
