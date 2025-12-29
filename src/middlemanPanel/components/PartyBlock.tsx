import type { PartyDto } from "@/shared/types/middlemanTypes/MiddlemanTypes"
import { User, Package } from "lucide-react"

type Props = { party: PartyDto }

const PartyBlock = ({ party }: Props) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-sm font-medium">{party.nickname}</div>
          <div className="text-xs text-muted-foreground">
            {party.gameOrCategory}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 p-3">
        <div className="flex items-start gap-2">
          <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">{party.itemTitle}</div>
            {party.itemSubtitle ? (
              <div className="text-xs text-muted-foreground">
                {party.itemSubtitle}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
export default PartyBlock
