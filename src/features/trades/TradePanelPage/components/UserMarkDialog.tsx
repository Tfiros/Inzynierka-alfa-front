import { useMemo, useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/dialog"
import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
import { Textarea } from "@/shared/components/textarea"
import type { CompleteAndMarkTradeRequest } from "@/shared/types/tradeTypes/MiddlemanTypes"

type UserLite = {
  id: number
  nickname?: string | null
  email?: string | null
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  buyer: UserLite | null
  seller: UserLite | null
  loading?: boolean
  onConfirm: (payload: CompleteAndMarkTradeRequest) => void
}

const gradeTo10 = (v: number) => Math.max(0, Math.min(10, v))

const UseMarkDialog = ({
  open,
  onOpenChange,
  buyer,
  seller,
  loading = false,
  onConfirm,
}: Props) => {
  const [buyerGrade, setBuyerGrade] = useState<number | null>(null)
  const [buyerDesc, setBuyerDesc] = useState("")
  const [sellerGrade, setSellerGrade] = useState<number | null>(null)
  const [sellerDesc, setSellerDesc] = useState("")

  useEffect(() => {
    if (!open) return
    setBuyerGrade(null)
    setBuyerDesc("")
    setSellerGrade(null)
    setSellerDesc("")
  }, [open])

  const canConfirm = useMemo(() => {
    if (!buyer?.id || !seller?.id) return false
    if (buyerGrade == null || sellerGrade == null) return false
    if (!buyerDesc.trim() || !sellerDesc.trim()) return false
    return true
  }, [buyer?.id, seller?.id, buyerGrade, sellerGrade, buyerDesc, sellerDesc])

  const handleConfirm = () => {
    if (!buyer || !seller) return
    if (!canConfirm) return

    onConfirm({
      buyersID: buyer.id,
      buyersGrade: gradeTo10(buyerGrade ?? 0),
      buyersDescription: buyerDesc.trim(),
      sellersID: seller.id,
      sellersGrade: gradeTo10(sellerGrade ?? 0),
      sellersDescription: sellerDesc.trim(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Zakończ wymianę i oceń użytkowników</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border p-4">
            <div className="text-xs text-muted-foreground">Odbierający</div>
            <div className="mt-1 text-sm font-medium">
              {buyer?.nickname ?? "—"}
            </div>
            <div className="text-xs text-muted-foreground">
              {buyer?.email ?? "—"}
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              Ocena (0–10)
            </div>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={10}
              step={1}
              disabled={loading}
              value={buyerGrade ?? ""}
              onChange={(e) => {
                const raw = e.target.value
                if (raw === "") return setBuyerGrade(null)
                const n = Number(raw)
                setBuyerGrade(Number.isFinite(n) ? gradeTo10(n) : null)
              }}
              placeholder="np. 8"
            />

            <div className="mt-3 text-xs text-muted-foreground">
              Uzasadnienie
            </div>
            <Textarea
              disabled={loading}
              value={buyerDesc}
              onChange={(e) => setBuyerDesc(e.target.value)}
              placeholder="Wymagane. Napisz krótko dlaczego taka ocena..."
            />
          </div>

          <div className="rounded-xl border p-4">
            <div className="text-xs text-muted-foreground">Wystawiający</div>
            <div className="mt-1 text-sm font-medium">
              {seller?.nickname ?? "—"}
            </div>
            <div className="text-xs text-muted-foreground">
              {seller?.email ?? "—"}
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              Ocena (0–10)
            </div>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={10}
              step={1}
              disabled={loading}
              value={sellerGrade ?? ""}
              onChange={(e) => {
                const raw = e.target.value
                if (raw === "") return setSellerGrade(null)
                const n = Number(raw)
                setSellerGrade(Number.isFinite(n) ? gradeTo10(n) : null)
              }}
              placeholder="np. 10"
            />

            <div className="mt-3 text-xs text-muted-foreground">
              Uzasadnienie
            </div>
            <Textarea
              disabled={loading}
              value={sellerDesc}
              onChange={(e) => setSellerDesc(e.target.value)}
              placeholder="Wymagane. Napisz krótko dlaczego taka ocena..."
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className={loading ? "" : "cursor-pointer"}
          >
            Anuluj
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={!canConfirm || loading}
            className={!canConfirm || loading ? "" : "cursor-pointer"}
          >
            {loading ? "Zapisywanie..." : "Zakończ i zapisz oceny"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UseMarkDialog
