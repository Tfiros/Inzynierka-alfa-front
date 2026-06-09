import { Outlet, useLocation } from "react-router-dom"
import { Footer } from "./Footer"
import { Suspense } from "react"
import PageFallback from "./PageFallback"
import PageLoadError from "./PageLoadError"
import ErrorBoundary from "../components/ErrorBoundary"

const BlankLayout = () => {
  const location = useLocation()
  return (
    <div>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 pt-6 pb-12">
        <ErrorBoundary path={location.pathname} fallback={<PageLoadError />}>
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}

export default BlankLayout
