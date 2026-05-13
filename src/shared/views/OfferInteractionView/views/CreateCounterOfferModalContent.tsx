import { useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/select"
import { useOfferGameItemDropdown } from "../hooks/UseOfferGameItemDropdown"
import OfferPickedItemsList from "../components/OfferPickedItemsList"
import { useCreateCounterOffer } from "@/features/profilePage/hooks/UseCreateCounterOffer"
import { useCounterOfferModal } from "@/features/marketplacePage/hooks/UseCounterOfferModal"

type Props = {
  offerId: number | null
  onCancel: () => void
}
export default function CreateCounterOfferModalContent({
  offerId,
  onCancel,
}: Props) {
  const { baseOffer, baseOfferLoading, baseOfferError } =
    useCounterOfferModal(offerId)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [tokensInput, setTokensInput] = useState("0")

  const suggestions = useItemSuggestions()
  const itemDropdown = useOfferGameItemDropdown()

  const {
    items,
    setTokens,
    submitError,
    submitting,
    serverCost,
    quoteLoading,
    quoteError,
    canConfirm,
    estimatedCost,
    summaryText,
    addItem,
    setQuantity,
    removeItem,
    openConfirm,
    submit,
  } = useCreateCounterOffer({
    offerId,
    onSuccess: () => {
      setConfirmOpen(false)
      onCancel()
    },
  })

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
            onRemoveItem={removeItem}
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
            Opłata za utworzenie kontroferty: {estimatedCost} tokenów
          </div>

          <Button
            className="h-10 flex-1 rounded-xl text-base font-semibold bg-black text-white border-black"
            disabled={!canConfirm || quoteLoading}
            onClick={async () => {
              const ok = await openConfirm()
              if (ok) {
                setConfirmOpen(true)
              }
            }}
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
              Finalna opłata za utworzenie kontroferty:
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
                void submit()
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
