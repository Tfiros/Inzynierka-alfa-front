import { Outlet, useLocation } from "react-router-dom"
import { UserNavbar } from "./navbar/views/UserNavbar"
import { Footer } from "./Footer"
import GuestNavbar from "./navbar/views/GuestNavbar"
import useMainLayout from "./hooks/UseMainLayout"
import { lazy, Suspense } from "react"
import PageFallback from "./PageFallback"
import PageLoadError from "./PageLoadError"
import ErrorBoundary from "../components/ErrorBoundary"

const NotificationsHubConnector = lazy(
  () => import("@/features/notifications/NotificationsHubConnector")
)

const ChatWindowHost = lazy(
  () => import("@/features/chat/components/ChatWindowHost")
)

const MainLayout = () => {
  const { isLogged, hasHydrated } = useMainLayout()
  const location = useLocation()

  if (!hasHydrated) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="flex min-h-screen flex-col">
      {isLogged ? <UserNavbar /> : <GuestNavbar />}
      <main className="flex-1 mx-auto w-full px-4 pt-6 pb-12">
        <ErrorBoundary path={location.pathname} fallback={<PageLoadError />}>
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      {isLogged && (
        <ErrorBoundary>
          <Suspense fallback={null}>
            <NotificationsHubConnector />
            <ChatWindowHost />
          </Suspense>
        </ErrorBoundary>
      )}

      <Footer />
    </div>
  )
}

export default MainLayout
