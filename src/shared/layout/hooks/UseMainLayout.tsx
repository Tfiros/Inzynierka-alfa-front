import { useEffect, useLayoutEffect } from "react"
import { useNotificationsHub } from "../hooks/UseNotificationsHub"
import { useAppStore } from "../../store/appStore"

const useMainLayout = () => {
  const isLogged = useAppStore((s) => s.isAuthenticated)
  const syncSession = useAppStore((s) => s.syncSession)

  const darkMode = useAppStore((s) => s.darkMode)
  const hasHydrated = useAppStore((s) => s.hasHydrated)

  useEffect(() => {
    void syncSession()
  }, [syncSession])

  useNotificationsHub()

  useLayoutEffect(() => {
    if (!hasHydrated) return
    document.documentElement.classList.toggle("dark", darkMode)
  }, [hasHydrated, darkMode])

  return { isLogged, hasHydrated }
}

export default useMainLayout
