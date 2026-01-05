import { HomeDashboardPublic } from "./PublicHomeDashboard"
import { HomeDashboardPrivate } from "./PrivateHomeDashBoard"

export const MainDashboard = () => {
  const isAuthenticated = false

  return isAuthenticated ? <HomeDashboardPrivate /> : <HomeDashboardPublic />
}
