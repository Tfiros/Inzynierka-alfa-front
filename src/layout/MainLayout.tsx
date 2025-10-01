import { Outlet } from "react-router-dom";
import TopNav from "./navbar"; 
import Footer from "./footer";
export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav /> 
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 pt-6 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}