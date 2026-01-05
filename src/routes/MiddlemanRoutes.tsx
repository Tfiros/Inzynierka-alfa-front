import { useAppStore } from "@/shared/store/AppStore"
import { Navigate, Outlet } from "react-router-dom"

const MiddlemanRoute = () => {
  const roles = useAppStore((s) => s.roles)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  const isMiddleman = roles.some((r) => r.toLowerCase() === "middleman")

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isMiddleman) return <Navigate to="/" replace />

  return <Outlet />
}

export default MiddlemanRoute
