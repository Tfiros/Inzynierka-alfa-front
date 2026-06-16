import { memo } from "react"
import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
import { MoreVertical, Pencil, Trash2, Check, X as XIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu"

import type { ChatMessage } from "@/shared/types/chat/ChatDtos"

type Props = {
  message: ChatMessage
  mine: boolean
  busy: boolean
  deleted: boolean
  editExpired: boolean
  displayTitle: string
  editingId: number | null
  editText: string
  setEditText: (value: string) => void
  canEditOrDelete: (message: ChatMessage) => boolean
  startEdit: (message: ChatMessage) => void
  cancelEdit: () => void
  saveEdit: (messageId: number) => void | Promise<void>
  deleteMessage: (messageId: number) => void | Promise<void>
}

const ChatMessageItem = ({
  message,
  mine,
  busy,
  deleted,
  editExpired,
  displayTitle,
  editingId,
  editText,
  setEditText,
  canEditOrDelete,
  startEdit,
  cancelEdit,
  saveEdit,
  deleteMessage,
}: Props) => {
  const isEditing = editingId === message.id

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[78%] ${mine ? "text-right" : "text-left"}`}>
        <div className="mb-1 text-[11px] text-muted-foreground">
          {mine ? "Ty" : displayTitle} •{" "}
          {new Date(message.createdAt).toLocaleString()}
          {message.editedAt ? " (edyt.)" : ""}
        </div>

        <div className="group flex items-start gap-2">
          <div className="pt-1">
            {canEditOrDelete(message) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    disabled={busy || deleted}
                    className="rounded-md p-1 hover:bg-accent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => startEdit(message)}
                    disabled={busy || deleted || editExpired}
                    className={
                      busy || deleted || editExpired ? "" : "cursor-pointer"
                    }
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    {editExpired ? "Edycja wygasła" : "Edytuj"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className={
                      busy || deleted
                        ? "text-destructive"
                        : "text-destructive cursor-pointer"
                    }
                    onClick={() => deleteMessage(message.id)}
                    disabled={busy || deleted}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Usuń
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div
            className={[
              "inline-block rounded-2xl px-3 py-2 leading-snug shadow-sm border",
              mine
                ? "bg-primary text-primary-foreground border-primary/30 rounded-br-sm"
                : "bg-muted text-foreground border-border rounded-bl-sm",
              deleted ? "opacity-70 italic" : "",
            ].join(" ")}
          >
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(message.id)}
                  disabled={busy}
                />

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => saveEdit(message.id)}
                  disabled={busy}
                  className="cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={cancelEdit}
                  disabled={busy}
                  className="cursor-pointer"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              message.message
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ChatMessageItem)
