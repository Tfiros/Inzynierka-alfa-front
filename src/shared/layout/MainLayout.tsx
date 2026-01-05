import { Outlet } from "react-router-dom"
import { useEffect } from "react"
import { UserNavbar } from "./navbar/views/UserNavbar"
import { Footer } from "./Footer"
import GuestNavbar from "./navbar/views/GuestNavbar"
import { useAppStore } from "../store/AppStore"

export const MainLayout = () => {
  const isLogged = useAppStore((s) => s.isAuthenticated)
  const syncSession = useAppStore((s) => s.syncSession)

  useEffect(() => {
    void syncSession()
  }, [syncSession])

  return (
    <div className="flex min-h-screen flex-col">
      {isLogged ? <UserNavbar /> : <GuestNavbar />}
      <main className="flex-1 mx-auto w-full px-4 pt-6 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
