import { useEffect, useLayoutEffect, useRef } from "react"
import { useAppStore } from "../../store/appStore"
import { useNotificationsHub } from "@/features/Notifications/NotificationsDropdown/hooks/UseNotificationsHub"

const useMainLayout = () => {
  const isLogged = useAppStore((s: any) => s.isAuthenticated)
  const syncSession = useAppStore((s: any) => s.syncSession)

  const darkMode = useAppStore((s: any) => s.darkMode)
  const hasHydrated = useAppStore((s: any) => s.hasHydrated)
  const refreshNavbarUserFromAuth = useAppStore(
    (s: any) => s.refreshNavbarUserFromAuth
  )

  const ranRef = useRef(false)

  useNotificationsHub()

  useEffect(() => {
    if (!hasHydrated) return

    if (!isLogged) {
      ranRef.current = false
      return
    }

    if (ranRef.current) return
    ranRef.current = true

    void Promise.resolve(syncSession()).catch(console.error)
  }, [hasHydrated, isLogged, syncSession])

  useLayoutEffect(() => {
    if (!hasHydrated) return
    document.documentElement.classList.toggle("dark", darkMode)
  }, [hasHydrated, darkMode])

  return { isLogged, hasHydrated }
}

export default useMainLayout
