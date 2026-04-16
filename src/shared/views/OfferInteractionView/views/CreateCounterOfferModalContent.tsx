import { useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"

import SectionTitle from "../components/SectionTitle"
import SearchSuggest from "../components/SearchSuggest"

import { Button } from "@/shared/components/button"
import { DialogHeader, DialogTitle } from "@/shared/components/dialog"
import { Input } from "@/shared/components/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/alert-dialog"

import { useItemSuggestions } from "../hooks/UseItemSuggestions"
import type { offerDetailsDtoResponse } from "@/shared/types/offerTypes/RequestResponseTypes"
import type { CounterOfferDraftRequest } from "@/shared/types/counterOfferTypes/RequestResponseTypes"
import { CounterOfferService } from "@/shared/api/services/CounterOfferService"
import { useAppStore } from "@/shared/store/appStore"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/select"
import IconSquareButton from "../components/IconSquareButton"
import { useOfferGameItemDropdown } from "../hooks/UseOfferGameItemDropdown"

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

export default function CreateCounterOfferModalContent({
  offerId,
  onCancel,
  baseOffer,
  baseOfferLoading,
  baseOfferError,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const suggestions = useItemSuggestions()
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)

  const [items, setItems] = useState<PickedItem[]>([])
  const [tokens, setTokens] = useState(0)

  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const itemDropdown = useOfferGameItemDropdown()

  const [serverCost, setServerCost] = useState<number | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState<string | null>(null)

  const [tokensInput, setTokensInput] = useState("0")

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

  const removeOne = (itemId: number) => {
    setItems((previousItems) =>
      previousItems.filter((x) => x.itemId !== itemId)
    )
  }

  const removeAll = () => setItems([])

  const canConfirm =
    (items.length > 0 || tokens > 0) && tokens >= 0 && !submitting

  const extractMsg = (x: unknown): string => {
    if (!x || typeof x !== "object") return ""

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

    if (typeof obj.message === "string") return obj.message

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

  const estimatedCost = useMemo(() => tokens + 20, [tokens])

  const buildRequest = (): CounterOfferDraftRequest => ({
    tokensOffered: tokens,
    items: items.map((i) => ({
      itemId: i.itemId,
      quantity: i.quantity,
    })),
  })

  const handleOpenConfirm = async () => {
    if (!offerId) return

    setQuoteLoading(true)
    setQuoteError(null)
    setSubmitError(null)

    try {
      const res = await CounterOfferService.quote(offerId, buildRequest())

      if (!res.isSuccess || !res.data) {
        setQuoteError(res.message ?? "Nie udało się pobrać wyceny kontroferty.")
        return
      }

      setServerCost(res.data.totalCost)
      setConfirmOpen(true)
    } catch (err: unknown) {
      const msg = extractMsg(err)
      setQuoteError(msg || "Nie udało się pobrać wyceny kontroferty.")
    } finally {
      setQuoteLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!offerId) return

    setSubmitting(true)
    setSubmitError(null)

    const request = buildRequest()

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
      setConfirmOpen(false)
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

  const summaryText = useMemo(() => {
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0)
    return `${items.length} przedmiotów, łączna liczba sztuk: ${itemsCount}, tokeny: ${tokens}`
  }, [items, tokens])

  return (
    <>
      <DialogHeader className="flex flex-col items-center gap-y-2">
        <DialogTitle className="text-lg font-semibold">
          Złóż propozycję kontroferty
        </DialogTitle>
      </DialogHeader>

      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
        <div className="mt-4 rounded-xl border bg-muted/20 px-4 py-3">
          {baseOfferLoading && (
            <p className="text-sm text-muted-foreground">Ładowanie oferty...</p>
          )}

          {!baseOfferLoading && baseOfferError && (
            <p className="text-sm text-red-500">{baseOfferError}</p>
          )}

          {!baseOfferLoading && !baseOfferError && baseOffer && (
            <div className="flex items-center justify-between gap-4">
              <p className="min-w-0 text-sm font-medium text-foreground line-clamp-1">
                {baseOffer.offeredItems
                  .slice(0, 2)
                  .map((x) => {
                    const itemName = x.itemDto.name
                    const gameName = x.itemDto.game?.name
                    return gameName ? `${itemName} · ${gameName}` : itemName
                  })
                  .join(", ")}
                {baseOffer.offeredItems.length > 3 ? "..." : ""}
              </p>

              <div className="shrink-0 text-xs text-muted-foreground">
                {baseOffer.offeredItems.length} szt.
              </div>
            </div>
          )}
        </div>
        <div className="py-12">
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

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1">
              <Select
                value={itemDropdown.gameId ? String(itemDropdown.gameId) : ""}
                onValueChange={(v) =>
                  itemDropdown.setGame(v ? Number(v) : null)
                }
              >
                <SelectTrigger className="h-10 rounded-xl bg-muted/40 border-muted-foreground/20 w-full">
                  <SelectValue placeholder="Wybierz grę" />
                </SelectTrigger>
                <SelectContent>
                  {itemDropdown.gamesLoading && (
                    <SelectItem value="__loading" disabled>
                      Ładowanie...
                    </SelectItem>
                  )}
                  {!itemDropdown.gamesLoading &&
                    itemDropdown.games.map((g) => (
                      <SelectItem key={g.id} value={String(g.id)}>
                        {g.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {itemDropdown.gamesError && (
                <div className="mt-2 text-sm text-red-500">
                  {itemDropdown.gamesError}
                </div>
              )}
            </div>

            <div className="flex-[2]">
              <SearchSuggest
                value={itemDropdown.query}
                onChange={itemDropdown.setQuery}
                suggestions={itemDropdown.items}
                loading={itemDropdown.itemsLoading}
                error={itemDropdown.itemsError}
                disabled={
                  submitting ||
                  itemDropdown.gameId == null ||
                  itemDropdown.gamesLoading
                }
                onPickSuggestion={(item) => {
                  addItem(item)
                  itemDropdown.reset()
                }}
              />
            </div>

            <div className="shrink-0">
              <IconSquareButton
                ariaLabel="Dodaj przedmiot do kontroferty"
                onClick={() => {}}
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {items.map((it) => (
              <div
                key={it.itemId}
                className="rounded-xl border bg-background px-4 py-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{it.name}</div>
                    {it.gameName && (
                      <div className="text-xs text-muted-foreground">
                        {it.gameName}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) =>
                        setQuantity(it.itemId, Number(e.target.value))
                      }
                      disabled={submitting}
                      className="h-10 w-24 rounded-xl bg-muted/40 border-muted-foreground/20"
                    />

                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => removeOne(it.itemId)}
                      disabled={submitting}
                    >
                      Usuń
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {items.length > 0 && (
              <div className="pt-1">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={removeAll}
                  disabled={submitting}
                >
                  Usuń wszystko
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-2">
          <SectionTitle>Tokeny</SectionTitle>

          <div className="mt-3">
            <Input
              type="text"
              inputMode="numeric"
              value={tokensInput}
              onFocus={() => {
                if (tokensInput === "0") {
                  setTokensInput("")
                }
              }}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "")
                setTokensInput(digitsOnly)
                setTokens(digitsOnly === "" ? 0 : Number(digitsOnly))
              }}
              onBlur={() => {
                if (tokensInput === "") {
                  setTokensInput("0")
                }
              }}
              disabled={submitting}
              className="h-10 rounded-xl bg-muted/40 border-muted-foreground/20"
              placeholder="0"
            />
          </div>
        </div>

        {submitError && (
          <div className="mt-4 text-sm text-red-500">{submitError}</div>
        )}

        <div className="mt-10 border-t pt-4 flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Szacowany koszt: {estimatedCost} tokenów
          </div>

          <Button
            className="h-10 flex-1 rounded-xl text-base font-semibold bg-black text-white border-black"
            disabled={!canConfirm || quoteLoading}
            onClick={() => void handleOpenConfirm()}
          >
            <Plus className="mr-2 h-5 w-5" />
            {quoteLoading ? "Pobieranie wyceny..." : "Złóż kontrofertę"}
          </Button>

          <Button
            variant="outline"
            className="h-10 rounded-xl px-8 text-base"
            onClick={onCancel}
            disabled={submitting || quoteLoading}
          >
            Anuluj
          </Button>
        </div>

        {quoteError && (
          <div className="mt-2 text-sm text-red-500">{quoteError}</div>
        )}
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potwierdź wysłanie kontroferty</AlertDialogTitle>
            <AlertDialogDescription>
              Finalny koszt kontroferty:
              <span className="ml-2 font-semibold">
                {serverCost ?? "-"} tokenów
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="text-sm text-muted-foreground">{summaryText}</div>

          {submitError && (
            <div className="mt-2 text-sm text-red-500">{submitError}</div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting || quoteLoading}>
              Wróć
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={submitting || quoteLoading}
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
