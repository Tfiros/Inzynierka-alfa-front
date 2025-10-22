import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainDashboard } from '@/homeDashboard/views/MainDashboard'
import { MainLayout } from '@/layout/MainLayout'
import { LandingPage } from './landingPage/LandingPage'
import { FAQs } from './FAQs/faqsSite'

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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
