import { useEffect, useRef } from "react"
import { useAppStore } from "@/shared/store/AppStore"
import { NotificationsHubClient } from "@/shared/api/hubs/NotificationsHubClient"

type Props = {
  logErrors?: boolean
  onError?: (err: unknown) => void
}

export const useNotificationsHub = (options?: Props) => {
  const sessionChecked = useAppStore((s) => s.sessionChecked)
  const isLogged = useAppStore((s) => s.isAuthenticated)

  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!sessionChecked || !isLogged) {
        await NotificationsHubClient.stop()
        return
      }

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
      void NotificationsHubClient.stop()
    }
  }, [sessionChecked, isLogged])
}
