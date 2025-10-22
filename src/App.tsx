import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainDashboard } from '@/homeDashboard/views/MainDashboard'
import { MainLayout } from '@/layout/MainLayout'
import { LandingPage } from './landingPage/LandingPage'
import { FAQs } from './FAQs/faqsSite'
import { UserProfilePage } from '@/profilePage/profilePage'
import { StatutePage } from '@/statutePage/statutePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<MainDashboard />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="oferty" element={<div>Oferty</div>} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="points" element={<div>Points</div>} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="statute" element={<StatutePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
