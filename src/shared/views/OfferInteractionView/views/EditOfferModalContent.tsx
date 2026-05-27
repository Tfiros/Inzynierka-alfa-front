import { useState } from "react"
import { useItemSuggestions } from "../hooks/UseItemSuggestions"
import { DialogHeader, DialogTitle } from "@/shared/components/dialog"
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
} from "@/shared/components/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/select"
import SectionTitle from "../components/SectionTitle"
import SearchSuggest from "../components/SearchSuggest"
import OfferPickedItemsList from "../components/OfferPickedItemsList"
import DurationCard from "../components/DurationCard"
import { Switch } from "@/shared/components/ui/switch"
import { Plus } from "lucide-react"
import { useEditOffer } from "../hooks/UseEditOffer"
import { Input } from "@/shared/components/input"
import { Textarea } from "@/shared/components/textarea"
import { useOfferGameItemDropdown } from "../hooks/UseOfferGameItemDropdown"
import type {
  ItemOfferDto,
  offerUpdateQuoteResponse,
} from "@/shared/types/offerTypes/RequestResponseTypes"
import IconSquareButton from "../components/IconSquareButton"

type EditOfferModalContentProps = {
  onCancel: () => void
  offerId: number
}

const EditOfferModalContent = ({
  onCancel,
  offerId,
}: EditOfferModalContentProps) => {
  const offer = useEditOffer(offerId)

  const haveSuggestions = useItemSuggestions()
  const wantSuggestions = useItemSuggestions()

  const haveDropdown = useOfferGameItemDropdown()
  const wantDropdown = useOfferGameItemDropdown()
  const [haveLockedItem, setHaveLockedItem] = useState<ItemOfferDto | null>(
    null
  )
  const [wantLockedItem, setWantLockedItem] = useState<ItemOfferDto | null>(
    null
  )
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [serverQuote, setServerQuote] =
    useState<offerUpdateQuoteResponse | null>(null)

  const handleOpenConfirm = async () => {
    const cost = await offer.getServerQuote()
    if (cost == null) return
    setServerQuote(cost)
    setConfirmOpen(true)
  }

  const handleConfirmUpdate = async () => {
    const ok = await offer.updateOffer()
    if (!ok) return
    setConfirmOpen(false)
    setServerQuote(null)
    offer.reset()
    onCancel()
  }
  return (
    <>
      <DialogHeader className="flex flex-col items-center gap-y-2">
        <DialogTitle className="text-lg font-semibold">
          Edytuj ofertę
        </DialogTitle>
      </DialogHeader>
      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
        <div className="mt-4">
          <SectionTitle>Tytuł</SectionTitle>
          <Input
            value={offer.title}
            onChange={(e) => offer.setTitle(e.target.value)}
            disabled={offer.isLoading || offer.quoteIsLoading}
            placeholder="Tytuł oferty"
          />
        </div>

        <div className="mt-6">
          <SectionTitle>Opis</SectionTitle>
          <Textarea
            value={offer.description}
            onChange={(e) => offer.setDescription(e.target.value)}
            disabled={offer.isLoading || offer.quoteIsLoading}
            placeholder="Opis oferty"
          />
        </div>
        <div>
          <SectionTitle>Co oferujesz?</SectionTitle>

          <SearchSuggest
            value={haveSuggestions.query}
            onChange={haveSuggestions.setQuery}
            suggestions={haveSuggestions.suggestions}
            loading={haveSuggestions.loading}
            error={haveSuggestions.error}
            onPickSuggestion={(item) => {
              offer.addHaveItem(item)
              haveSuggestions.setQuery("")
            }}
            disabled={offer.isLoading}
            pending={haveSuggestions.pending}
          />

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1">
              <Select
                value={haveDropdown.gameId ? String(haveDropdown.gameId) : ""}
                onValueChange={(v) =>
                  haveDropdown.setGame(v ? Number(v) : null)
                }
              >
                <SelectTrigger className="h-10 rounded-xl bg-muted/40 border-muted-foreground/20 w-full">
                  <SelectValue placeholder="Wybierz grę" />
                </SelectTrigger>
                <SelectContent>
                  {haveDropdown.gamesLoading && (
                    <SelectItem value="__loading" disabled>
                      Ładowanie...
                    </SelectItem>
                  )}
                  {!haveDropdown.gamesLoading &&
                    haveDropdown.games.map((g) => (
                      <SelectItem key={g.id} value={String(g.id)}>
                        {g.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {haveDropdown.gamesError && (
                <div className="mt-2 text-sm text-red-500">
                  {haveDropdown.gamesError}
                </div>
              )}
            </div>

            <div className="flex-[2]">
              <SearchSuggest
                value={haveDropdown.query}
                onChange={haveDropdown.setQuery}
                suggestions={haveDropdown.items}
                loading={haveDropdown.itemsLoading}
                error={haveDropdown.itemsError}
                disabled={
                  offer.isLoading ||
                  offer.quoteIsLoading ||
                  haveDropdown.gameId == null ||
                  haveDropdown.gamesLoading
                }
                onPickSuggestion={(item) => {
                  setHaveLockedItem(item)
                }}
                lockedItem={haveLockedItem}
                onUnlock={() => {
                  setHaveLockedItem(null)
                  haveDropdown.setQuery("")
                }}
                pending={haveDropdown.itemsPending}
              />
            </div>
            <div className="shrink-0">
              <IconSquareButton
                ariaLabel="Dodaj oferowany przedmiot"
                disabled={
                  !haveLockedItem || offer.isLoading || offer.quoteIsLoading
                }
                onClick={() => {
                  if (!haveLockedItem) return
                  offer.addHaveItem(haveLockedItem)
                  setHaveLockedItem(null)
                  haveDropdown.reset()
                }}
              />
            </div>
          </div>
          <OfferPickedItemsList
            items={offer.itemsHave}
            disabled={offer.isLoading || offer.quoteIsLoading}
            onSetQuantity={offer.setHaveQuantity}
            onRemoveItem={offer.removeAllHaveItem}
          />
          <div className="mt-4">
            <label className="text-sm font-medium text-muted-foreground">
              Tokeny oferowane (opcjonalnie)
            </label>
            <Input
              type="number"
              min={0}
              value={offer.tokensOffered || ""}
              onChange={(e) =>
                offer.setTokensOffered(
                  Math.max(0, parseInt(e.target.value) || 0)
                )
              }
              disabled={offer.isLoading || offer.quoteIsLoading}
              className="mt-2 h-10 rounded-xl bg-muted/40 border-muted-foreground/20"
              placeholder="0"
            />
          </div>
        </div>
        <div className="py-12">
          <SectionTitle>Czego szukasz?</SectionTitle>

          <SearchSuggest
            value={wantSuggestions.query}
            onChange={wantSuggestions.setQuery}
            suggestions={wantSuggestions.suggestions}
            loading={wantSuggestions.loading}
            error={wantSuggestions.error}
            onPickSuggestion={(item) => {
              offer.addWantItem(item)
              wantSuggestions.setQuery("")
            }}
            disabled={offer.isLoading}
            pending={wantSuggestions.pending}
          />

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1">
              <Select
                value={wantDropdown.gameId ? String(wantDropdown.gameId) : ""}
                onValueChange={(v) =>
                  wantDropdown.setGame(v ? Number(v) : null)
                }
              >
                <SelectTrigger className="h-10 rounded-xl bg-muted/40 border-muted-foreground/20 w-full">
                  <SelectValue placeholder="Wybierz grę" />
                </SelectTrigger>
                <SelectContent>
                  {wantDropdown.gamesLoading && (
                    <SelectItem value="__loading" disabled>
                      Ładowanie...
                    </SelectItem>
                  )}
                  {!wantDropdown.gamesLoading &&
                    wantDropdown.games.map((g) => (
                      <SelectItem key={g.id} value={String(g.id)}>
                        {g.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {wantDropdown.gamesError && (
                <div className="mt-2 text-sm text-red-500">
                  {wantDropdown.gamesError}
                </div>
              )}
            </div>

            <div className="flex-[2]">
              <SearchSuggest
                value={wantDropdown.query}
                onChange={wantDropdown.setQuery}
                suggestions={wantDropdown.items}
                loading={wantDropdown.itemsLoading}
                error={wantDropdown.itemsError}
                disabled={
                  offer.isLoading ||
                  offer.quoteIsLoading ||
                  wantDropdown.gameId == null ||
                  wantDropdown.gamesLoading
                }
                onPickSuggestion={(item) => {
                  setWantLockedItem(item)
                }}
                lockedItem={wantLockedItem}
                onUnlock={() => {
                  setWantLockedItem(null)
                  wantDropdown.setQuery("")
                }}
                pending={wantDropdown.itemsPending}
              />
            </div>
            <div className="shrink-0">
              <IconSquareButton
                ariaLabel="Dodaj szukany przedmiot"
                disabled={
                  !wantLockedItem || offer.isLoading || offer.quoteIsLoading
                }
                onClick={() => {
                  if (!wantLockedItem) return
                  offer.addWantItem(wantLockedItem)
                  setWantLockedItem(null)
                  wantDropdown.reset()
                }}
              />
            </div>
          </div>
          <OfferPickedItemsList
            items={offer.itemsWant}
            disabled={offer.isLoading || offer.quoteIsLoading}
            onSetQuantity={offer.setWantQuantity}
            onRemoveItem={offer.removeAllWantItem}
          />
          <div className="mt-4">
            <label className="text-sm font-medium text-muted-foreground">
              Tokeny oczekiwane (opcjonalnie)
            </label>
            <Input
              type="number"
              min={0}
              value={offer.tokensWanted || ""}
              onChange={(e) =>
                offer.setTokensWanted(
                  Math.max(0, parseInt(e.target.value) || 0)
                )
              }
              disabled={offer.isLoading || offer.quoteIsLoading}
              className="mt-2 h-10 rounded-xl bg-muted/40 border-muted-foreground/20"
              placeholder="0"
            />
          </div>
        </div>
        <div className="mt-6">
          <SectionTitle>Ważność oferty</SectionTitle>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <DurationCard
              selected={offer.durationDays === 0}
              title="Bez zmian"
              subtitle={""}
              onClick={() => offer.setDurationDays(0)}
            />
            <DurationCard
              selected={offer.durationDays === 7}
              title="7 dni"
              subtitle="Bazowy koszt"
              onClick={() => offer.setDurationDays(7)}
            />
            <DurationCard
              selected={offer.durationDays === 14}
              title="14 dni"
              subtitle="+30 tokenów"
              onClick={() => offer.setDurationDays(14)}
            />
            <DurationCard
              selected={offer.durationDays === 31}
              title="31 dni"
              subtitle="+60 tokenów"
              onClick={() => offer.setDurationDays(31)}
            />
          </div>
        </div>
        <div className="mt-6">
          <SectionTitle>Opcje promocji (opcjonalne)</SectionTitle>

          <div className="mt-4 rounded-2xl border bg-muted/10 px-6 py-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">Wyróżnienie oferty</div>
                <div className="text-sm text-muted-foreground">+50 tokenów</div>
              </div>
              <Switch
                checked={offer.isHighlighted}
                onCheckedChange={offer.setIsHighlighted}
              />
            </div>
          </div>
        </div>
        {offer.error && (
          <div className="mt-2 text-sm text-red-500">{offer.error}</div>
        )}
        <div className="mt-10 border-t pt-4 flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Koszt: {offer.updateFeePreview ?? "-"}
          </div>
          <Button
            type="button"
            className="h-10 flex-1 rounded-xl text-base font-semibold bg-black text-white border-black"
            disabled={!offer.canSubmit}
            onClick={() => {
              void handleOpenConfirm()
            }}
          >
            <Plus className="mr-2 h-5 w-5" />
            Edytuj ofertę
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl px-8 text-base"
            onClick={onCancel}
            disabled={offer.isLoading}
          >
            Anuluj
          </Button>
        </div>
      </div>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potwierdź utworzenie oferty</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="text-sm">
                Nowy koszt całkowity:{" "}
                <span className="ml-2 font-semibold">
                  {serverQuote?.newTotalCost ?? "-"}
                </span>
              </div>
              <div className="text-sm mt-1">
                Dopłata za aktualizację:{" "}
                <span className="ml-2 font-semibold">
                  {serverQuote?.updateFee ?? "-"}
                </span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={offer.isLoading || offer.quoteIsLoading}
            >
              Wróć
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={offer.isLoading || offer.quoteIsLoading}
              onClick={(e) => {
                e.preventDefault()
                void handleConfirmUpdate()
              }}
            >
              Zatwierdź i zapisz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default EditOfferModalContent
