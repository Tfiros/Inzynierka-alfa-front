import { Switch } from "@/shared/components/switch"
import { useEffect, useState } from "react"

const status = "darkMode"

const DarkModeSwitch = () => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(status)
    const initial = saved === "true"

    setEnabled(initial)
    document.documentElement.classList.toggle("dark", initial)
  }, [])

  const toggle = (checked: boolean) => {
    setEnabled(checked)
    localStorage.setItem(status, String(checked))
    document.documentElement.classList.toggle("dark", checked)
  }

  return <Switch id="dark-mode" checked={enabled} onCheckedChange={toggle} />
}

export default DarkModeSwitch
