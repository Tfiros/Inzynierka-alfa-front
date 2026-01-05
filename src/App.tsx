import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "@/shared/layout/MainLayout"
import { BlankLayout } from "./shared/layout/BlankLayout"
import { LandingPage } from "./features/landingPage/LandingPage"
import { ProfileEdit } from "./features/profileEditPage/ProfileEdit"
import Marketplace from "./features/marketplacePage/Marketplace"
import { AdminRoute } from "./routes/AdminRoutes"
import UserManagementPage from "./features/userManagement/UserManagementPage"
import ItemManagementPage from "./features/ItemManagementPage/ItemManagementPage"
import MiddlemanPanelPage from "./features/middlemanPanelPage/MiddlemanPanelPage"
import { NotFoundPage } from "./features/notFoundPage/NotFoundPage"
import { MiddlemanRoute } from "./routes/MiddlemanRoutes"
import { useAppStore } from "./shared/store/AppStore"
import { MainDashboard } from "./features/profilePanelPage/views/MainDashboard"
import { FaqsSite } from "./features/faqsPage/faqsSite"
import { PointShop } from "./features/pointShop/pointShop"
import { UserProfilePage } from "./features/profilePage/profilePage"
import { StatutePage } from "./features/statutePage/statutePage"
import { ContactPage } from "./features/contactPage/contactPage"

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
          <Route path="profile/:id" element={<UserProfilePage />} />
          <Route path="statute" element={<StatutePage />} />
          <Route path="shop" element={<PointShop />} />
          <Route path="profileEdit" element={<ProfileEdit />} />
          <Route path="marketplace" element={<Marketplace />} />
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
