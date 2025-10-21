import { Outlet } from 'react-router-dom'
import { UserNavbar} from './navbar/views/UserNavbar'
import { Footer } from './Footer';
import GuestNavbar from './navbar/views/GuestNavbar';
export const MainLayout = () => {
  const isLogged = true;
  return (
    <div className="flex min-h-screen flex-col">
      {isLogged ? <UserNavbar /> : <GuestNavbar />}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 pt-6 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
