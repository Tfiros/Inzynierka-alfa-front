import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeDashboard from '@/homeDashboard/homeDashboard'
import MainLayout from '@/layout/MainLayout'
import LandingPage from './landingPage/landingPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<HomeDashboard />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="oferty" element={<div>Oferty</div>} />
          <Route path="faqs" element={<div>FAQs</div>} />
          <Route path="points" element={<div>Points</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
