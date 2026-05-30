import { Button } from "@/shared/components/button"
import type { MiddlemanTab } from "@/shared/types/tradeTypes/MiddlemanTypes"
import { List, PackageOpen, X } from "lucide-react"

type Props = {
  tab: MiddlemanTab
  tokenCost: number
  onDetails: () => void
  onCanceleTrade: () => void
  onCompleteClick: () => void
}

const TradeActionsMyTrade = ({
  tab,
  tokenCost,
  onDetails,
  onCanceleTrade,
  onCompleteClick,
}: Props) => {
  const showManagementActions = tab == "mine"
  const isReturnTab = tab === "failedReturns"
  const detailsButtonLabel = isReturnTab ? "Zarządzaj zwrotem" : "Szczegóły"
  const DetailsButtonIcon = isReturnTab ? PackageOpen : List
  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Koszt tokenów:</span>
        <span className="text-foreground">{tokenCost}</span>
      </div>

      <Button
        variant="outline"
        className="mt-3 w-full gap-2 border-gray-900 hover:bg-gray-100 cursor-pointer"
        onClick={onDetails}
      >
        <DetailsButtonIcon className="h-4 w-4" />
        {detailsButtonLabel}
      </Button>

      {showManagementActions ? (
        <>
          <Button
            className="mt-3 w-full gap-2 bg-green-600 text-white hover:bg-green-700 cursor-pointer"
            onClick={onCompleteClick}
          >
            <X className="h-4 w-4" />
            Potwierdź zakończenie wymiany
          </Button>

          <Button
            className="mt-3 w-full gap-2 bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            onClick={onCanceleTrade}
          >
            <X className="h-4 w-4" />
            Anuluj wymianę
          </Button>
        </>
      ) : null}
    </div>
  )
}

export default TradeActionsMyTrade
