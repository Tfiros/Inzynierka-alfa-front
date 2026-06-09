import { Outlet } from "react-router-dom"
import { Footer } from "./Footer"

const BlankLayout = () => {
  return (
    <div>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 pt-6 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default BlankLayout
