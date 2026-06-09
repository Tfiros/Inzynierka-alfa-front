import { useAppStore } from "@/shared/store/appStore"
import { Navigate, Outlet } from "react-router-dom"

const AdminRoute = () => {
  const roles = useAppStore((s) => s.roles)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  const isAdmin = roles.some((r) => r.toLowerCase() === "admin")

  if (!isAuthenticated || !isAdmin) return <Navigate to="/" replace />

  return <Outlet />
}

export default AdminRoute
