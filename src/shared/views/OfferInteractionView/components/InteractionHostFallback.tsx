import { Dialog, DialogContent } from "@/shared/components/dialog"
import { Loader2 } from "lucide-react"

const InteractionHostFallback = () => {
  return (
    <Dialog open>
      <DialogContent
        showCloseButton={false}
        className="w-fit border-none bg-transparent p-0 shadow-none"
      >
        <Loader2 className="size-8 animate-spin text-white" />
      </DialogContent>
    </Dialog>
  )
}

export default InteractionHostFallback
