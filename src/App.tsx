import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useAppStore } from "./shared/store/appStore"
import AdminRoute from "./routes/AdminRoutes"
import BlankLayout from "./shared/layout/BlankLayout"
import MainLayout from "./shared/layout/MainLayout"
import ItemManagementPage from "./features/ItemManagementPage/ItemManagementPage"
import TradePanelPage from "./features/Trades/TradePanelPage/TradePanelPage"
import ContactPage from "./features/contactPage/ContactPage"
import FaqsSite from "./features/faqsPage/FaqsSite"
import LandingPage from "./features/landingPage/LandingPage"
import MarketplacePage from "./features/marketplacePage/Marketplace"
import NotFoundPage from "./features/notFoundPage/NotFoundPage"
import PointShop from "./features/pointShop/PointShop"
import ProfileEdit from "./features/profileEditPage/ProfileEdit"
import ProfilePage from "./features/profilePage/ProfilePage"
import MainDashboard from "./features/profilePanelPage/views/MainDashboard"
import SettingsPage from "./features/settingsPage/SettingsPage"
import StatutePage from "./features/statutePage/StatutePage"
import UserManagementPage from "./features/userManagement/UserManagementPage"

function App() {
  const initSecurity = useAppStore((s) => s.initSecurity)

  useEffect(() => {
    initSecurity().catch(() => {})
  }, [initSecurity])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<MainDashboard />} />
          <Route path="oferty" element={<div>Oferty</div>} />
          <Route path="faqs" element={<FaqsSite />} />
          <Route path="profile/:id" element={<ProfilePage />} />
          <Route path="statute" element={<StatutePage />} />
          <Route path="shop" element={<PointShop />} />
          <Route path="profileEdit" element={<ProfileEdit />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="tradePanel" element={<TradePanelPage />} />

          <Route element={<AdminRoute />}>
            <Route path="userManagement" element={<UserManagementPage />} />
            <Route path="itemManagement" element={<ItemManagementPage />} />
          </Route>
        </Route>

        <Route element={<BlankLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
