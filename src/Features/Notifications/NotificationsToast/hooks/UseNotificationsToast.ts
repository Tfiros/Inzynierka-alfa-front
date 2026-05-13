import { useEffect, useState } from "react"
import type { NotificationDto } from "@/shared/types/notificationsTypes/notificationsDtos"

type ToastItem = NotificationDto & {
  toastId: string
}

export const useNotificationsToast = () => {
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

  const removeToast = (toastId: string) => {
    setItems((prev) => prev.filter((x) => x.toastId !== toastId))
  }

  return {
    items,
    removeToast,
  }
}
