import type { NotificationDto } from "@/shared/types/notificationsTypes/notificationsDtos"
import { X } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { formatNotificationDate } from "@/shared/utilities/Notifications/dateFormat"

type Props = {
  notification: NotificationDto
  onRead: (id: number) => void
  onDelete: (id: number) => void
}

export const NotificationItem = ({ notification, onRead, onDelete }: Props) => {
  const isUnread = !notification.isRead

  return (
    <button
      type="button"
      onClick={() => {
        if (isUnread) onRead(notification.id)
      }}
      className={cn(
        "group flex w-full cursor-pointer items-start justify-between gap-3 border-b px-3 py-3 text-left transition",
        "hover:bg-muted/50",
        isUnread ? "bg-blue-500/5 dark:bg-blue-500/10" : "bg-transparent"
      )}
    >
      <div className="flex min-w-0 items-start gap-2">
        {isUnread && (
          <span className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-blue-500" />
        )}

        <div className="min-w-0">
          <p
            className={cn(
              "line-clamp-1 text-sm",
              isUnread
                ? "font-semibold text-foreground"
                : "font-medium text-foreground/80"
            )}
          >
            {notification.title}
          </p>

          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {notification.message}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-start gap-2">
        <span className="text-[11px] text-muted-foreground">
          {formatNotificationDate(notification.createdAt)}
        </span>

        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete(notification.id)
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter" && e.key !== " ") return
            e.preventDefault()
            e.stopPropagation()
            onDelete(notification.id)
          }}
          className="
            inline-flex h-7 w-7 items-center justify-center rounded-full
            text-muted-foreground opacity-50
            transition
            hover:bg-destructive/10 hover:text-destructive
            group-hover:opacity-100 cursor-pointer
          "
        >
          <X className="h-4 w-4" />
        </span>
      </div>
    </button>
  )
}
