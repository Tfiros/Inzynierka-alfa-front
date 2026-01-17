import { Switch } from "@/shared/components/switch"
import { useEffect } from "react"
import { useAppStore } from "@/shared/store/appStore"

const DarkModeSwitch = () => {
  const darkMode = useAppStore((s) => s.darkMode)
  const setDarkMode = useAppStore((s) => s.setDarkMode)
  const hasHydrated = useAppStore((s) => s.hasHydrated)

  useEffect(() => {
    if (!hasHydrated) return
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode, hasHydrated])

  return (
    <Switch
      id="dark-mode"
      checked={darkMode}
      onCheckedChange={setDarkMode}
      disabled={!hasHydrated}
    />
  )
}

export default DarkModeSwitch
