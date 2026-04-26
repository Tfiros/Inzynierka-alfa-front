import { Outlet } from "react-router-dom"
import { UserNavbar } from "./navbar/views/UserNavbar"
import { Footer } from "./Footer"
import GuestNavbar from "./navbar/views/GuestNavbar"
import DarkModeSwitch from "@/shared/components/DarkModeSwitch"
import useMainLayout from "./hooks/UseMainLayout"
import ChatWindowHost from "@/Features/Chat/components/ChatWindowHost"

const MainLayout = () => {
  const { isLogged, hasHydrated } = useMainLayout()

  if (!hasHydrated) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="hidden">
        <DarkModeSwitch />
      </div>

      {isLogged ? <UserNavbar /> : <GuestNavbar />}
      <main className="flex-1 mx-auto w-full px-4 pt-6 pb-12">
        <Outlet />
      </main>
      {isLogged && <ChatWindowHost />}

      <Footer />
    </div>
  )
}

export default MainLayout
