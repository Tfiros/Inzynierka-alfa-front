import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeDashboard from "@/homeDashboard/homeDashboard";
import MainLayout from "@/layout/MainLayout";
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomeDashboard />} />
          <Route path="perks" element={<div>Perks</div>} />
          <Route path="works" element={<div>Works</div>} />
          <Route path="pricing" element={<div>Pricing</div>} />
          <Route path="faqs" element={<div>FAQs</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
