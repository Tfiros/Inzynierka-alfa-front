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
import type {
  ItemOfferDto,
  offerDetailsDtoResponse,
} from "@/shared/types/offerTypes/RequestResponseTypes"
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
import { useOfferGameItemDropdown } from "../hooks/UseOfferGameItemDropdown"
import OfferPickedItemsList from "../components/OfferPickedItemsList"
import {
  addOfferLine,
  removeOfferLine,
  setOfferLineQuantity,
  type OfferLine,
} from "../utils/OfferHelpers"

type Props = {
  offerId: number | null
  onCancel: () => void
  baseOffer: offerDetailsDtoResponse | null
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
  const [confirmOpen, setConfirmOpen] = useState(false)
  const suggestions = useItemSuggestions()
  const refreshNavbar = useAppStore((s) => s.refreshNavbarUserFromAuth)

  const [items, setItems] = useState<OfferLine[]>([])
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
  }, [tokens, items])

  const addItem = (item: ItemOfferDto) => {
    setItems((previousItems) => addOfferLine(previousItems, item))
  }

  const setQuantity = (item: ItemOfferDto, quantity: number) => {
    setItems((previousItems) =>
      setOfferLineQuantity(previousItems, item, quantity)
    )
  }

  const removeOne = (itemId: number) => {
    setItems((previousItems) => removeOfferLine(previousItems, itemId))
  }

  const canConfirm =
    (items.length > 0 || tokens > 0) && tokens >= 0 && !submitting

  const estimatedCost = useMemo(() => tokens + 20, [tokens])

  const buildRequest = (): CounterOfferDraftRequest => ({
    tokensOffered: tokens,
    items: items.map((i) => ({
      itemId: i.item.id,
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
        setQuoteError(res.message || "Nie udało się pobrać wyceny kontroferty.")
        return
      }

      setServerCost(res.data.totalCost)
      setConfirmOpen(true)
    } catch {
      setQuoteError("Nie udało się pobrać wyceny kontroferty.")
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
        setSubmitError(res.message || "Nie udało się wysłać kontroferty.")
        return
      }

      await refreshNavbar()
      setConfirmOpen(false)
      onCancel()
    } catch {
      setSubmitError("Nie udało się wysłać kontroferty.")
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
                    const gameName = x.itemDto.game.name
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
          </div>

          <OfferPickedItemsList
            items={items}
            disabled={submitting}
            onSetQuantity={setQuantity}
            onRemoveItem={removeOne}
          />
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
