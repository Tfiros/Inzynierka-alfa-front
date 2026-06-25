import { useCallback, useState } from "react"
import { TradeService } from "@/shared/api/services/TradeService"
import { extractErrorMessage } from "@/shared/utilities/errorHandlers"

type UseTradeDetailsSaveArgs = {
  tradeId: number | null
  hasBuyersItems: boolean
  hasSellersItems: boolean
  onSaved: () => void | Promise<void>
  onAfterSave?: () => void
}

const useTradeDetailsSave = ({
  tradeId,
  hasBuyersItems,
  hasSellersItems,
  onSaved,
  onAfterSave,
}: UseTradeDetailsSaveArgs) => {
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const save = useCallback(async () => {
    if (!tradeId) return

    setSaving(true)
    setSaveError(null)

    try {
      const res = await TradeService.updateByMiddleman(tradeId, {
        hasBuyerItems: hasBuyersItems,
        hasSellerItems: hasSellersItems,
      })

      if (!res.isSuccess) {
        setSaveError(res.message ?? "Nie udało się zapisać zmian.")
        return
      }

      await onSaved()
      onAfterSave?.()
    } catch (e) {
      setSaveError(extractErrorMessage(e, "Nie udało się zapisać zmian."))
    } finally {
      setSaving(false)
    }
  }, [tradeId, hasBuyersItems, hasSellersItems, onSaved, onAfterSave])

  return { save, saving, saveError, setSaveError }
}
export default useTradeDetailsSave
