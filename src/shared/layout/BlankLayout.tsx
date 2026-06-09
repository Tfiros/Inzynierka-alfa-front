import { Outlet } from "react-router-dom"
import { Footer } from "./Footer"
import { Suspense } from "react"
import PageFallback from "./PageFallback"

const BlankLayout = () => {
  return (
    <div>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 pt-6 pb-12">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default BlankLayout
