import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "@/shared/layout/MainLayout"
import { BlankLayout } from "./shared/layout/BlankLayout"
import { LandingPage } from "./Features/landingPage/LandingPage"
import { MainDashboard } from "@/homeDashboard/views/MainDashboard"
import { FAQs } from "./Features/faqsPage/faqsSite"
import { UserProfilePage } from "@/Features/profilePage/profilePage"
import { StatutePage } from "@/Features/statutePage/statutePage"
import { ProfileEdit } from "./Features/profileEditPage/ProfileEdit"
import Marketplace from "./Features/marketplacePage/Marketplace"
import { AdminRoute } from "./routes/AdminRoutes"
import UserManagementPage from "./Features/userManagement/UserManagementPage"
import ItemManagementPage from "./ItemManagement/ItemManagementPage"
import MiddlemanPanelPage from "./Features/middlemanPanelPage/MiddlemanPanelPage"
import { NotFoundPage } from "./Features/notFoundPage/NotFoundPage"
import { MiddlemanRoute } from "./routes/MiddlemanRoutes"
import { ContactPage } from "./Features/contactPage/contactPage"
import { PointShop } from "./Features/pointShop/pointShop"
import { useAppStore } from "./shared/store/appStore"

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
          <Route path="faqs" element={<FAQs />} />
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
