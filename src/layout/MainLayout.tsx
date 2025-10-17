import { Outlet } from 'react-router-dom'
import TopNav from './navbar'
import Footer from './footer'
import QuestNavbar from './unLoggednavbar'
export default function MainLayout() {
  const isLogged = true
  return (
    <div className="flex min-h-screen flex-col">
      {isLogged ? <TopNav /> : <QuestNavbar />}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 pt-6 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
