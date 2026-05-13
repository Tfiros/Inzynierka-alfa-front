import { useEffect, useRef } from "react"
import { useAppStore } from "@/shared/store/AppStore"
import { NotificationsHubClient } from "@/shared/api/hubs/NotificationsHubClient"
import type { NotificationDto } from "@/shared/types/notificationsTypes/notificationsDtos"

type Props = {
  logErrors?: boolean
  onError?: (err: unknown) => void
}

export const useNotificationsHub = (options?: Props) => {
  const sessionChecked = useAppStore((s) => s.sessionChecked)
  const isLogged = useAppStore((s) => s.isAuthenticated)
  const pushNotification = useAppStore((s) => s.pushNotification)

  const optionsRef = useRef(options)
  const pushNotificationRef = useRef(pushNotification)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  useEffect(() => {
    pushNotificationRef.current = pushNotification
  }, [pushNotification])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!sessionChecked || !isLogged) {
        NotificationsHubClient.clearHandlers()
        await NotificationsHubClient.stop()
        return
      }

      NotificationsHubClient.setHandlers({
        notificationCreated: (notification: NotificationDto) => {
          pushNotificationRef.current(notification)

          window.dispatchEvent(
            new CustomEvent("notification:created", {
              detail: notification,
            })
          )
        },
      })

      try {
        await NotificationsHubClient.start()
      } catch (e) {
        if (cancelled) return

        const currentOptions = optionsRef.current

        if (currentOptions?.onError) {
          currentOptions.onError(e)
          return
        }

        if (currentOptions?.logErrors ?? true) {
          console.error("[NotificationsHub] start failed", e)
        }
      }
    }

    void run()

    return () => {
      cancelled = true
      NotificationsHubClient.clearHandlers()
      void NotificationsHubClient.stop()
    }
  }, [sessionChecked, isLogged])
}
