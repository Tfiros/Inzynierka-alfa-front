import { useState } from "react"
import SectionTitle from "../components/SectionTitle"
import { Button } from "@/shared/components/button"
import { Plus } from "lucide-react"
import { DialogHeader, DialogTitle } from "@/shared/components/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/select"
import IconSquareButton from "../components/IconSquareButton"
import SearchSuggest from "../components/SearchSuggest"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/alert-dialog"
import { useOfferGameItemDropdown } from "../hooks/UseOfferGameItemDropdown"
import OfferPickedItemsList from "../components/OfferPickedItemsList"
import { useItemSuggestions } from "../hooks/UseItemSuggestions"
import type { useCreateOffer } from "../hooks/UseCreateOffer"

type CreateCounterOfferModalContentProps = {
  onCancel: () => void
  offer: ReturnType<typeof useCreateOffer>
}
const CreateOfferModalContent = ({
  offer,
}: CreateCounterOfferModalContentProps) => {
  const wantSuggestions = useItemSuggestions()

  const handleOpenConfirm = async () => {
    const cost = await offer.getServerQuote()
    if (cost == null) return
    setServerCost(cost)
    setConfirmOpen(true)
  }

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [serverCost, setServerCost] = useState<number | null>(null)

  const haveDropdown = useOfferGameItemDropdown()
  const wantDropdown = useOfferGameItemDropdown()
  return (
    <>
      <DialogHeader className="flex flex-col items-center gap-y-2">
        <DialogTitle className="text-lg font-semibold">
          Złóż propozycję Kontroferty
        </DialogTitle>
      </DialogHeader>
      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
        <div className="mt-4">
          <p>Tutaj będą pobierane informacje o ofercie dla bazowej</p>
        </div>
        <div className="py-12">
          <SectionTitle>Co oferujesz?</SectionTitle>

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
                  {haveDropdown.gamesError}
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
                  offer.addWantItem(item)
                  wantDropdown.reset()
                }}
              />
            </div>

            <div className="shrink-0">
              <IconSquareButton
                ariaLabel="Dodaj oferowany przedmiot"
                onClick={() => {}}
              />
            </div>
          </div>
          <OfferPickedItemsList
            items={offer.itemsWant}
            disabled={offer.isLoading || offer.quoteIsLoading}
            onSetQuantity={offer.setWantQuantity}
            onRemoveAll={offer.removeAllWantItem}
          />
        </div>

        <div className="mt-10 border-t pt-4 flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Koszt: {20}</div>
          <Button
            type="button"
            className="h-10 flex-1 rounded-xl text-base font-semibold bg-black text-white border-black"
            disabled={
              offer.isLoading ||
              offer.quoteIsLoading ||
              offer.itemsHave.length == 0 ||
              offer.itemsWant.length === 0 ||
              offer.title.trim().length === 0
            }
            onClick={() => void handleOpenConfirm()}
          >
            <Plus className="mr-2 h-5 w-5" />
            Złóż kontrofertę
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl px-8 text-base"
          >
            Anuluj
          </Button>
        </div>
      </div>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potwierdź utworzenie oferty</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={offer.isLoading || offer.quoteIsLoading}
            >
              Wróć
            </AlertDialogCancel>
            <AlertDialogAction>Zatwierdź i wyślij</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default CreateOfferModalContent
