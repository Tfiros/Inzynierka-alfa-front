import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/dialog"
import { Badge } from "@/shared/components/badge"
import { Button } from "@/shared/components/button"
import { Skeleton } from "@/shared/components/skeleton"
import type {
  TradeDetailsResponse,
  TradeListItem,
} from "@/shared/types/tradeTypes/MiddlemanTypes"
import { Edit3, Eye } from "lucide-react"
import PhotosDropzone from "./PhotosDropzone"
import Flag from "./Flag"
import PhotosList from "./PhotosList"
import CheckboxRow from "./CheckboxRow"
import useTradeDetailsSave from "../hooks/UseTradeDetailsSave"

type Props = {
  open: boolean
  loading: boolean
  error: string | null
  trade: TradeListItem | null
  details: TradeDetailsResponse | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void | Promise<void>
}

type Mode = "view" | "edit"

const TradeDetailsDialog = ({
  open,
  loading,
  error,
  trade,
  details,
  onOpenChange,
  onSaved,
}: Props) => {
  const [mode, setMode] = useState<Mode>("view")

  const initial = useMemo(() => {
    return {
      hasBuyersItems: !!details?.hasBuyersItems,
      hasSellersItems: !!details?.hasSellersItems,
    }
  }, [details])

  const [hasBuyersItems, setHasBuyersItems] = useState(false)
  const [hasSellersItems, setHasSellersItems] = useState(false)

  const { save, saving, saveError, setSaveError } = useTradeDetailsSave({
    tradeId: trade?.tradeId ?? null,
    hasBuyersItems,
    hasSellersItems,
    onSaved,
    onAfterSave: () => setMode("view"),
  })

  useEffect(() => {
    setMode("view")
    setSaveError(null)
    setHasBuyersItems(initial.hasBuyersItems)
    setHasSellersItems(initial.hasSellersItems)
  }, [open, initial.hasBuyersItems, initial.hasSellersItems, setSaveError])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <DialogTitle>
              Szczegóły wymiany{" "}
              {trade ? (
                <span className="text-muted-foreground font-normal">
                  • Trade #{trade.tradeId} • Offer #{trade.offerId}
                </span>
              ) : null}
            </DialogTitle>

            {mode === "view" ? (
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => setMode("edit")}
                disabled={!trade}
              >
                <Edit3 className="h-4 w-4" />
                Edytuj
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => setMode("view")}
                disabled={saving}
              >
                <Eye className="h-4 w-4" />
                Podgląd
              </Button>
            )}
          </div>
        </DialogHeader>

        {error ? (
          <div className="rounded-xl border p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {saveError ? (
          <div className="rounded-xl border p-4 text-sm text-destructive">
            {saveError}
          </div>
        ) : null}

        {trade ? (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Token cost: {trade.tokenCost}</Badge>
            <Badge variant="secondary">StatusId: {trade.tradeStatusId}</Badge>
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border p-4">
            <div className="text-xs text-muted-foreground">
              Kupujący (customer)
            </div>
            <div className="mt-1 text-sm font-medium">
              {trade?.customer?.nickname ?? "—"}
            </div>
            <div className="text-xs text-muted-foreground">
              {trade?.customer?.email ?? "—"}
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="text-xs text-muted-foreground">
              Wystawiający (postingUser)
            </div>
            <div className="mt-1 text-sm font-medium">
              {trade?.postingUser?.nickname ?? "—"}
            </div>
            <div className="text-xs text-muted-foreground">
              {trade?.postingUser?.email ?? "—"}
            </div>
          </div>
        </div>

        {mode === "view" ? (
          <>
            <div className="mt-4 rounded-xl border p-4">
              <div className="text-sm font-medium">Stan przedmiotów</div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {loading ? (
                  <>
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-40" />
                  </>
                ) : (
                  <>
                    <Flag
                      ok={!!details?.hasBuyersItems}
                      label="Kupujący ma przedmioty"
                    />
                    <Flag
                      ok={!!details?.hasSellersItems}
                      label="Wystawiający ma przedmioty"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <div className="text-sm font-medium">Zdjęcia kupującego</div>
                <div className="mt-2">
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <PhotosList
                      photos={details?.buyingUserPhotos?.photos ?? []}
                    />
                  )}
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-sm font-medium">
                  Zdjęcia wystawiającego
                </div>
                <div className="mt-2">
                  {loading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <PhotosList
                      photos={details?.sellingUserPhotos?.photos ?? []}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border p-4">
              <div className="text-sm font-medium">Edycja flag</div>

              <div className="mt-3 space-y-3">
                <CheckboxRow
                  checked={hasBuyersItems}
                  onChange={setHasBuyersItems}
                  title="Kupujący ma przedmioty"
                  description="Ustaw na podstawie weryfikacji przedmiotów kupującego."
                  disabled={saving}
                />

                <CheckboxRow
                  checked={hasSellersItems}
                  onChange={setHasSellersItems}
                  title="Wystawiający ma przedmioty"
                  description="Ustaw na podstawie weryfikacji przedmiotów wystawiającego."
                  disabled={saving}
                />
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="text-sm font-medium">Zdjęcia (wkrótce)</div>
              <div className="mt-2 text-xs text-muted-foreground">
                Dodamy upload do backendu później. Teraz możesz przygotować
                pliki (max 5).
              </div>
              <div className="mt-3">
                <PhotosDropzone maxFiles={5} disabled={saving} />
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Zamknij
          </Button>

          {mode === "edit" ? (
            <Button onClick={save} disabled={!trade || saving}>
              {saving ? "Zapisywanie..." : "Zapisz"}
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TradeDetailsDialog
