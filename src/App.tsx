import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import { useAuthBootstrap } from "@/shared/AuthBootstrap"
const Splash = () => <div className="p-6">Ładowanie…</div>
import { MainDashboard } from "@/homeDashboard/views/MainDashboard"
import { MainLayout } from "@/layout/MainLayout"
import { LandingPage } from "./landingPage/LandingPage"
import { FAQs } from "./FAQs/faqsSite"
import { UserProfilePage } from "@/profilePage/profilePage"
import { StatutePage } from "@/statutePage/statutePage"
import Marketplace from "./marketplacePage/Marketplace"
import { AdminRoute } from "./routes/AdminRoutes"
import UserManagementPage from "./userManagement/UserManagementPage"
import ItemManagementPage from "./ItemManagement/ItemManagementPage"
import MiddlemanPanelPage from "./middlemanPanel/MiddlemanPanelPage"

function App() {
  const ready = useAuthBootstrap()

  if (!ready) return <Splash />
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<MainDashboard />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="oferty" element={<div>Oferty</div>} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="points" element={<div>Points</div>} />
          <Route path="profile/:id" element={<UserProfilePage />} />
          <Route path="statute" element={<StatutePage />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route element={<AdminRoute />}>
            <Route path="userManagement" element={<UserManagementPage />} />
            <Route path="itemManagement" element={<ItemManagementPage />} />
          </Route>
          <Route element={<MiddlemanPanelPage />}>
            <Route path="middlemanPanel" element={<MiddlemanPanelPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
