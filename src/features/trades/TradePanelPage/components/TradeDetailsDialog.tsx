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
import Flag from "./Flag"
import PhotosList from "./PhotosList"
import CheckboxRow from "./CheckboxRow"
import useTradeDetailsSave from "../hooks/UseTradeDetailsSave"
import TradeStatusPill from "./TradeStatusPill"
import useTradePhotoUpload from "../hooks/UseTradePhotoUpload"
import PhotosDropzone from "@/shared/components/PhotosDropzone"
import SegmentedTabs from "./SegmentedTabs"

type Props = {
  open: boolean
  loading: boolean
  error: string | null
  trade: TradeListItem | null
  details: TradeDetailsResponse | null
  onOpenChange: (open: boolean) => void
  onSaved: () => void | Promise<void>
  onPhotoUpload: () => void | Promise<void>
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
  onPhotoUpload,
}: Props) => {
  const [mode, setMode] = useState<Mode>("view")
  const [side, setSide] = useState<"buyer" | "seller">("buyer")

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

  const photos = useTradePhotoUpload({
    tradeId: trade?.tradeId ?? null,
    onUpload: onPhotoUpload,
  })

  useEffect(() => {
    setMode("view")
    setSide("buyer")
    setSaveError(null)
    setHasBuyersItems(initial.hasBuyersItems)
    setHasSellersItems(initial.hasSellersItems)
    photos.actions.reset()
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
            <Badge variant="secondary">
              Koszt oferty: {trade.creationCost}
            </Badge>
            <TradeStatusPill tradeStatusId={trade.tradeStatusId} />
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border p-4">
            <div className="text-xs text-muted-foreground">
              Odbierający (customer)
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
                      label="Odbierający otrzymał przedmioty"
                    />
                    <Flag
                      ok={!!details?.hasSellersItems}
                      label="Wystawiający otrzymał przedmioty"
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
              <div className="text-sm font-medium">Edycja statusu odbioru</div>

              <div className="mt-3 space-y-3">
                <CheckboxRow
                  checked={hasBuyersItems}
                  onChange={setHasBuyersItems}
                  title="Odbierający ma przedmioty"
                  description="Zaznacz, jezeli odbierający otrzymał przedmioty."
                  disabled={saving}
                />

                <CheckboxRow
                  checked={hasSellersItems}
                  onChange={setHasSellersItems}
                  title="Wystawiający ma przedmioty"
                  description="Zaznacz, jezeli wystawiający otrzymał przedmioty."
                  disabled={saving}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium">Upload zdjęć</div>
              <SegmentedTabs
                value={side}
                onChange={setSide}
                tabs={[
                  { value: "buyer", label: "Odbierający" },
                  { value: "seller", label: "Wystawiający" },
                ]}
              />
              <PhotosDropzone
                photos={
                  side === "buyer" ? photos.buyerFiles : photos.sellerFiles
                }
                onChange={
                  side === "buyer"
                    ? photos.setBuyerFiles
                    : photos.setSellerFiles
                }
                maxFiles={5}
                disabled={saving || photos.uploadTradeSide !== null}
              />
              <Button
                type="button"
                className="w-full"
                disabled={
                  !trade ||
                  (side === "buyer"
                    ? !photos.buyerFiles.length
                    : !photos.sellerFiles.length) ||
                  photos.uploadTradeSide !== null
                }
                onClick={() =>
                  void (side === "buyer"
                    ? photos.actions.uploadBuyer()
                    : photos.actions.uploadSeller())
                }
              >
                {photos.uploadTradeSide === side
                  ? "Wysyłanie..."
                  : `Wyślij (${side === "buyer" ? photos.buyerFiles.length : photos.sellerFiles.length})`}
              </Button>
              {photos.uploadError && (
                <div className="text-xs text-red-600">{photos.uploadError}</div>
              )}
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
