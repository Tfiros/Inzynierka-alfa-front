import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useAppStore } from "./shared/store/AppStore"
import ItemManagementPage from "./features/ItemManagementPage/ItemManagementPage"
import ContactPage from "./features/contactPage/ContactPage"
import FaqsSite from "./features/faqsPage/FaqsSite"
import LandingPage from "./features/landingPage/LandingPage"
import MarketplacePage from "./features/marketplacePage/Marketplace"
import MiddlemanPanelPage from "./features/middlemanPanelPage/MiddlemanPanelPage"
import NotFoundPage from "./features/notFoundPage/NotFoundPage"
import PointShop from "./features/pointShop/PointShop"
import ProfileEdit from "./features/profileEditPage/ProfileEdit"
import MainDashboard from "./features/profilePanelPage/views/MainDashboard"
import StatutePage from "./features/statutePage/StatutePage"
import UserManagementPage from "./features/userManagement/UserManagementPage"
import AdminRoute from "./routes/AdminRoutes"
import MiddlemanRoute from "./routes/MiddlemanRoutes"
import BlankLayout from "./shared/layout/BlankLayout"
import MainLayout from "./shared/layout/MainLayout"
import ProfilePage from "./features/profilePage/ProfilePage"

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
    </BrowserRouter>
  )
}

export default App
