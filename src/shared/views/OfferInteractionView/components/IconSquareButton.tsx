import { Button } from "@/shared/components/button"
import { Plus } from "lucide-react"

const IconSquareButton = ({
  ariaLabel,
  onClick,
  disabled,
}: {
  ariaLabel: string
  onClick: () => void
  disabled?: boolean
}) => {
  return (
    <Button
      type="button"
      variant="secondary"
      className="h-10 w-12 rounded-xl bg-muted text-muted-foreground hover:bg-muted/90 cursor-pointer"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      <Plus className="h-5 w-5" />
    </Button>
  )
}

export default IconSquareButton
