import { Navigate, Outlet } from "react-router-dom"
import { useAppStore } from "@/store/appStore"

export const AdminRoute = () => {
  const roles = useAppStore((s) => s.roles)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  const isAdmin = roles.some((r) => r.toLowerCase() === "admin")

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return <Outlet />
}
