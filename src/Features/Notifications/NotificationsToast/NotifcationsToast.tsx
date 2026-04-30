import { useEffect, useState } from "react"
import type { NotificationDto } from "@/shared/types/notificationsTypes/notificationsDtos"
import { X } from "lucide-react"

type ToastItem = NotificationDto & {
  toastId: string
}

export const NotificationRealtimeToastHost = () => {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<NotificationDto>
      const notification = customEvent.detail

      if (!notification) return

      const toast: ToastItem = {
        ...notification,
        toastId: `${notification.id}-${Date.now()}`,
      }

      setItems((prev) => [toast, ...prev].slice(0, 4))

      window.setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.toastId !== toast.toastId))
      }, 5000)
    }

    window.addEventListener("notification:created", handler)

    return () => {
      window.removeEventListener("notification:created", handler)
    }
  }, [])

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-5 left-5 z-[9999] flex w-[360px] flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.toastId}
          className="
            relative overflow-hidden rounded-xl border
            border-blue-500/70
            bg-blue-500/5 dark:bg-blue-500/10
            backdrop-blur
            p-4 shadow-2xl
            ring-1 ring-blue-500/30
            animate-in slide-in-from-left-5 fade-in duration-300
          "
        >
          <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />

          <div className="flex items-start justify-between gap-3 pl-2">
            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-semibold text-foreground">
                {item.title}
              </p>
              <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                {item.message}
              </p>
            </div>

            <button
              type="button"
              className="
                rounded-full p-1 text-muted-foreground
                hover:bg-blue-500/10 hover:text-blue-500
                transition
              "
              onClick={() =>
                setItems((prev) =>
                  prev.filter((x) => x.toastId !== item.toastId)
                )
              }
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
