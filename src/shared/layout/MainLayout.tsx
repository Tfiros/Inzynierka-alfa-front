import { Outlet } from "react-router-dom"
import { UserNavbar } from "./navbar/views/UserNavbar"
import { Footer } from "./Footer"
import GuestNavbar from "./navbar/views/GuestNavbar"
import useMainLayout from "./hooks/UseMainLayout"
import ChatWindowHost from "@/features/chat/components/ChatWindowHost"

const MainLayout = () => {
  const { isLogged, hasHydrated } = useMainLayout()

  if (!hasHydrated) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="flex min-h-screen flex-col">
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
