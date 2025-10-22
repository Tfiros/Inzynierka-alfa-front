import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {MainDashboard} from '@/homeDashboard/views/MainDashboard'
import {MainLayout} from '@/layout/MainLayout'
import {LandingPage} from './landingPage/LandingPage'
import './App.css'
import { useAuthBootstrap } from "@/shared/AuthBootstrap"; 
const Splash = () => <div className="p-6">Ładowanie…</div>;
function App() {
  const ready = useAuthBootstrap();

  if (!ready) return <Splash />; 
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<MainDashboard />} />
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
