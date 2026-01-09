import { useEffect } from "react"
import { useAppStore } from "@/shared/store/AppStore"
import { NotificationsHubClient } from "@/shared/api/NotificationsHubClient"

type Props = {
  logErrors?: boolean
  onError?: (err: unknown) => void
}
export const useNotificationsHub = (options?: Props) => {
  const sessionChecked = useAppStore((s) => s.sessionChecked)
  const isLogged = useAppStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (!sessionChecked) return

    if (!isLogged) {
      void NotificationsHubClient.stop()
      return
    }

    void NotificationsHubClient.start().catch((e) => {
      if (options?.onError) {
        options.onError(e)
        return
      }

      if (options?.logErrors ?? true) {
        console.error("[SignalR] start failed", e)
      }
    })

    return () => {
      void NotificationsHubClient.stop()
    }
  }, [sessionChecked, isLogged, options?.logErrors, options?.onError])
}
