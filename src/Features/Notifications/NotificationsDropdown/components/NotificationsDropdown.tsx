import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/shared/components/button"
import NoifyIcon from "@/shared/photos/NotificationIcon.svg"
import NoifyIcon_Dark from "@/shared/photos/NotificationIcon_Dark.svg"
import { NotificationItem } from "./NotificationItem"
import { useNotificationsDropdown } from "../hooks/UseNotificationsDropdown"
import { useAppStore } from "@/shared/store/appStore"

export const NotificationsDropdown = () => {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const unread = useAppStore((s) => s.navbarUser?.notificationsUnreadTotal ?? 0)

  const {
    notifications,
    isLoading,
    hasMore,
    ensureLoaded,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationsDropdown()

  useEffect(() => {
    if (!open) return

    void ensureLoaded()
  }, [ensureLoaded, open])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!rootRef.current) return
      if (rootRef.current.contains(e.target as Node)) return
      setOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el || isLoading || !hasMore) return

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight

    if (distanceFromBottom < 80) {
      void loadMore()
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="rounded-full relative"
        title="Powiadomienia"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="relative">
          <img
            src={NoifyIcon}
            alt="NotificationIcon"
            className="h-6 w-6 object-contain block dark:hidden"
          />
          <img
            src={NoifyIcon_Dark}
            alt="NotificationIcon"
            className="h-6 w-6 object-contain hidden dark:block"
          />

          {unread > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[11px] leading-[18px] text-center">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </span>
      </Button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[380px] overflow-hidden rounded-xl border bg-background shadow-xl">
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
              onClick={() => void markAllAsRead()}
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

          <div className="border-t px-4 py-3">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-sm font-medium text-primary hover:underline"
            >
              Zobacz wszystkie
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
