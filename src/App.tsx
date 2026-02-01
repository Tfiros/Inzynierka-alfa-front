import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useAppStore } from "./shared/store/appStore"
import ItemManagementPage from "./Features/ItemManagementPage/ItemManagementPage"
import ContactPage from "./Features/contactPage/contactPage"
import FaqsSite from "./Features/faqsPage/faqsSite"
import LandingPage from "./Features/landingPage/LandingPage"
import MarketplacePage from "./Features/marketplacePage/Marketplace"
import MiddlemanPanelPage from "./Features/Middleman/middlemanPanelPage/MiddlemanPanelPage"
import NotFoundPage from "./Features/NotFoundPage/NotFoundPage"
import PointShop from "./Features/pointShop/pointShop"
import ProfileEdit from "./Features/profileEditPage/ProfileEdit"
import MainDashboard from "./Features/profilePanelPage/views/MainDashboard"
import StatutePage from "./Features/statutePage/statutePage"
import UserManagementPage from "./Features/userManagement/UserManagementPage"
import AdminRoute from "./routes/AdminRoutes"
import MiddlemanRoute from "./routes/MiddlemanRoutes"
import BlankLayout from "./shared/layout/BlankLayout"
import MainLayout from "./shared/layout/MainLayout"
import OfferInteractionHost from "./shared/views/OfferInteractionView/OfferInteractionHost"
import ProfilePage from "./Features/profilePage/profilePage"
import SettingsPage from "./Features/settingsPage/SettingsPage"

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

          <Route element={<AdminRoute />}>
            <Route path="userManagement" element={<UserManagementPage />} />
            <Route path="itemManagement" element={<ItemManagementPage />} />
          </Route>

          <Route element={<MiddlemanRoute />}>
            <Route path="middlemanPanel" element={<MiddlemanPanelPage />} />
          </Route>
        </Route>

        <Route element={<BlankLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <OfferInteractionHost />
    </BrowserRouter>
  )
}

export default App
