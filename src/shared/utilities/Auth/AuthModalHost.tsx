import { useAppStore } from "@/shared/store/appStore"
import { useEffect } from "react"
import AuthModal from "./AuthModal"

const AuthModalHost = () => {
  const open = useAppStore((s) => s.authModalOpen)
  const view = useAppStore((s) => s.authModalView)
  const setOpen = useAppStore((s) => s.setAuthModalOpen)
  const setView = useAppStore((s) => s.setAuthModalView)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  useEffect(() => {
    if (isAuthenticated) {
      setOpen(false)
    }
  }, [isAuthenticated, setOpen])
  return (
    <AuthModal
      open={open}
      onOpenChange={setOpen}
      view={view}
      onViewChange={setView}
    />
  )
}

export default AuthModalHost
