import { useState } from "react"
import { Button } from "@/shared/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu"
import NoifyIcon from "@/shared/photos/NotificationIcon.svg"
import NoifyIcon_Dark from "@/shared/photos/NotificationIcon_Dark.svg"
import { NotificationItem } from "./NotificationItem"
import { useNotificationsDropdown } from "../hooks/UseNotificationsDropdown"

export const NotificationsDropdown = () => {
  const [open, setOpen] = useState(false)

  const {
    scrollRef,
    unread,
    notifications,
    isLoading,
    hasMore,
    handleScroll,
    markAsRead,
    handleMarkAllAsRead,
    deleteNotification,
  } = useNotificationsDropdown(open)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="relative rounded-full"
          title="Powiadomienia"
        >
          <span className="relative">
            <img
              src={NoifyIcon}
              alt="NotificationIcon"
              className="block h-6 w-6 object-contain dark:hidden"
            />
            <img
              src={NoifyIcon_Dark}
              alt="NotificationIcon"
              className="hidden h-6 w-6 object-contain dark:block"
            />

            {unread > 0 && (
              <span className="absolute -right-2 -top-2 h-[18px] min-w-[18px] rounded-full bg-destructive px-1 text-center text-[11px] leading-[18px] text-destructive-foreground">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(380px,calc(100vw-1rem))] overflow-hidden rounded-xl border bg-background p-0 shadow-xl"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Powiadomienia</p>
            <p className="text-xs text-muted-foreground">
              {unread > 0
                ? `Nieprzeczytane: ${unread}`
                : "Brak nieprzeczytanych"}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={unread === 0}
            className="text-xs"
          >
            Oznacz wszystkie jako przeczytane
          </Button>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[420px] overflow-y-auto"
        >
          {notifications.length === 0 && !isLoading && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              Nie masz jeszcze żadnych powiadomień.
            </div>
          )}

          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))}

          {isLoading && (
            <div className="px-4 py-4 text-center text-xs text-muted-foreground">
              Ładowanie...
            </div>
          )}

          {!hasMore && notifications.length > 0 && (
            <div className="px-4 py-4 text-center text-xs text-muted-foreground">
              To już wszystkie powiadomienia.
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
