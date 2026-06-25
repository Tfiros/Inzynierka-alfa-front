import { useAppStore } from "@/shared/store/appStore"
import { Navigate, Outlet } from "react-router-dom"

const UserRoutes = () => {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  if (!isAuthenticated) return <Navigate to="/" replace />

  return <Outlet />
}

export default UserRoutes
