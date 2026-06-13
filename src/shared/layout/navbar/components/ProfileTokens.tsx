import { Link } from "react-router-dom"
import PointsIcon from "@/shared/photos/PointsIcon.svg"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip"
import { Button } from "@/shared/components/button"

const ProfileTokens = ({
  tokens,
  escrowedTokens,
}: {
  tokens: number
  escrowedTokens: number
}) => {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className="rounded-full"
      title="Punkty"
    >
      <Link to="/shop">
        <img src={PointsIcon} alt="shop" className="h-6 w-6 object-contain" />
        <span className="ml-1 text-sm font-medium">
          {tokens.toLocaleString("pl-PL")}
        </span>
        {escrowedTokens > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="ml-1 rounded-md border border-green-500/40 bg-green-500/10 px-2 py-0.5 text-sm font-medium text-green-400">
                +{escrowedTokens.toString()}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              Trzymane przy aktywnych ofertach, kontrofertach i trwających
              wymianach.
              <br />
              Wracają do salda, gdy wymiana się zakończy, anulujesz
              ofertę/kontrofertę lub twoja kontroferta zostanie odrzucona
            </TooltipContent>
          </Tooltip>
        )}
      </Link>
    </Button>
  )
}

export default ProfileTokens
