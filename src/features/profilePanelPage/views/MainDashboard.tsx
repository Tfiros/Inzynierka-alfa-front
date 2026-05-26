import PrivateHomeDashboard from "./PrivateHomeDashBoard"
import PublicHomeDashboard from "./PublicHomeDashboard"

const MainDashboard = () => {
  const isAuthenticated = false

  return isAuthenticated ? <PrivateHomeDashboard /> : <PublicHomeDashboard />
}

export default MainDashboard
