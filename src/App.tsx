import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
const Splash = () => <div className="p-6">Ładowanie…</div>
import { MainDashboard } from '@/homeDashboard/views/MainDashboard'
import { MainLayout } from '@/layout/MainLayout'
import { LandingPage } from './landingPage/LandingPage'
import { FAQs } from './FAQs/faqsSite'
import { UserProfilePage } from '@/profilePage/profilePage'
import { StatutePage } from '@/statutePage/statutePage'
import { PointShop } from './pointShop/pointShop'
import { NotFoundPage } from './NotFoundPage/NotFoundPage'
import { BlankLayout } from './layout/BlankLayout'
import { ProfileEdit } from './ProfileEdit/ProfileEdit'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<MainDashboard />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="oferty" element={<div>Oferty</div>} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="profile/:id" element={<UserProfilePage />} />
          <Route path="statute" element={<StatutePage />} />
          <Route path="shop" element={<PointShop />} />
          <Route path="profileEdit" element={<ProfileEdit />} />
        </Route>
        <Route element={<BlankLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
