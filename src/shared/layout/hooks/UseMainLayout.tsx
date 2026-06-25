import { useEffect, useLayoutEffect, useRef } from "react"
import { useAppStore } from "../../store/appStore"

const useMainLayout = () => {
  const isLogged = useAppStore((s) => s.isAuthenticated)
  const syncSession = useAppStore((s) => s.syncSession)

  const darkMode = useAppStore((s) => s.darkMode)
  const hasHydrated = useAppStore((s) => s.hasHydrated)

  const ranRef = useRef(false)

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
