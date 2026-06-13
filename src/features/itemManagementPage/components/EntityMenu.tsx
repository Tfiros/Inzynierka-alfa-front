import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu"
import { Button } from "@/shared/components/button"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"

const EntityMenu = (props: { onEdit: () => void; onDelete: () => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={props.onEdit} className="cursor-pointer">
          <Pencil className="mr-2 h-4 w-4" />
          Edytuj
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={props.onDelete}
          className="text-red-600 cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Usuń
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default EntityMenu
