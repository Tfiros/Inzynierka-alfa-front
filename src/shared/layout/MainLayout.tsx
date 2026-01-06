import { Outlet } from "react-router-dom"
import { useEffect } from "react"
import { UserNavbar } from "./navbar/views/UserNavbar"
import { Footer } from "./Footer"
import GuestNavbar from "./navbar/views/GuestNavbar"
import { useAppStore } from "../store/AppStore"
import { NotificationsHubClient } from "../api/NotificationsHubClient"
const MainLayout = () => {
  const isLogged = useAppStore((s) => s.isAuthenticated)
  const sessionChecked = useAppStore((s) => s.sessionChecked)
  const syncSession = useAppStore((s) => s.syncSession)

  useEffect(() => {
    void syncSession()
  }, [syncSession])

  useEffect(() => {
    if (!sessionChecked) return

    if (!isLogged) {
      void NotificationsHubClient.stop()
      return
    }

    void NotificationsHubClient.start().catch((e) => {
      console.log("[SignalR] start failed", e)
    })

    return () => {
      void NotificationsHubClient.stop()
    }
  }, [sessionChecked, isLogged])

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

export default MainLayout
