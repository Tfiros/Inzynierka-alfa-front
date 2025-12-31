import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "@/layout/MainLayout"
import { BlankLayout } from "./layout/BlankLayout"
import { LandingPage } from "./landingPage/LandingPage"
import { MainDashboard } from "@/homeDashboard/views/MainDashboard"
import { FAQs } from "./FAQs/faqsSite"
import { UserProfilePage } from "@/profilePage/profilePage"
import { StatutePage } from "@/statutePage/statutePage"
import { PointShop } from "./pointShop/pointShop"
import { ProfileEdit } from "./ProfileEdit/ProfileEdit"
import Marketplace from "./marketplacePage/Marketplace"
import { AdminRoute } from "./routes/AdminRoutes"
import UserManagementPage from "./userManagement/UserManagementPage"
import ItemManagementPage from "./ItemManagement/ItemManagementPage"
import MiddlemanPanelPage from "./middlemanPanel/MiddlemanPanelPage"
import { NotFoundPage } from "./NotFoundPage/NotFoundPage"
import { MiddlemanRoute } from "./routes/MiddlemanRoutes"
import { useAppStore } from "@/store/appStore"

function App() {
  const initSecurity = useAppStore((s) => s.initSecurity)

  useEffect(() => {
    // ✅ tylko CSRF bootstrap (GET /api/Auth/csrf)
    // bez syncSession/me na starcie
    initSecurity().catch(() => {})
  }, [initSecurity])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<MainDashboard />} />
          <Route path="oferty" element={<div>Oferty</div>} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="profile/:id" element={<UserProfilePage />} />
          <Route path="statute" element={<StatutePage />} />
          <Route path="shop" element={<PointShop />} />
          <Route path="profileEdit" element={<ProfileEdit />} />
          <Route path="marketplace" element={<Marketplace />} />

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
