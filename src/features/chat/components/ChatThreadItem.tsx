import { memo } from "react"
import type { ChatThreadListItemDto } from "@/shared/types/chat/ChatDtos"
import { chatThreadTitle } from "@/shared/utilities/Chat/chatThreadTitle"

type Props = {
  thread: ChatThreadListItemDto
  online: boolean | null
  onOpen: (thread: ChatThreadListItemDto) => void | Promise<void>
}

const threadPreview = (t: ChatThreadListItemDto) => t.lastMessageText ?? ""
const threadUnread = (t: ChatThreadListItemDto) => t.unreadCount ?? 0

const ChatThreadItem = ({ thread, online, onOpen }: Props) => {
  const isClosed = !!thread.closedAtUtc
  const unread = threadUnread(thread)

  return (
    <button
      type="button"
      className="w-full rounded-lg px-3 py-2 text-left hover:bg-accent cursor-pointer"
      onClick={() => onOpen(thread)}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {online !== null && (
              <span
                title={online ? "Online" : "Offline"}
                className={`h-2 w-2 shrink-0 rounded-full ${
                  online ? "bg-green-500" : "bg-muted-foreground/30"
                }`}
              />
            )}

            <div className="truncate text-sm font-medium">
              {chatThreadTitle(thread)}
            </div>

            {isClosed && (
              <span className="shrink-0 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                Zamknięty
              </span>
            )}
          </div>

          <div className="truncate text-xs text-muted-foreground">
            {isClosed ? "Czat zamknięty" : threadPreview(thread)}
          </div>
        </div>

        {unread > 0 && (
          <div className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
            {unread}
          </div>
        )}
      </div>
    </button>
  )
}

export default memo(ChatThreadItem)
