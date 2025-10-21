import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import CrossTradeLogo from '@/photos/CrossTradeLogo.png'
import PointsIcon from '@/photos/PointsIcon.svg'
import NoifyIcon from '@/photos/NotificationIcon.svg'
import { NavItem } from '../components/navItem';
import { ProfileMenu } from '../components/profileMenu';

export const TopNav = () => {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-6">
        <div className="w-20" />

        <div className="flex gap-2 -ml-200">
          <Link to="/" className="inline-flex items-center gap-2">
            <img
              src={CrossTradeLogo}
              alt="CROSSTRADE"
              className="h-15 w-15 object-contain"
            />
            <span className="sr-only">CROSSTRADE</span>
          </Link>
        </div>

        <nav className="flex items-center gap-4 text-sm">
          <div className="flex gap-6">
            <NavItem to="/oferty" label="Oferty" />
            <NavItem to="/faqs" label="FAQs" />
          </div>

          <div className="flex gap-1">
            <Button asChild variant="ghost" size="sm" className="rounded-full" title='Points'>
              <Link to="/points">
                <img
                  src={PointsIcon}
                  alt="Points"
                  className="h-6 w-6 object-contain"
                />
                <span className="text-sm">125</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="rounded-full" title='Level'>
              <Link to="/points">
                <span className="text-sm">10</span>
                <span>lvl</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="rounded-full" title = 'Notifications'>
              <Link to="/notifications">
                <img
                  src={NoifyIcon}
                  alt="NotificationIcon"
                  className="h-6 w-6 object-contain"
                />
              </Link>
            </Button>

            <ProfileMenu />
          </div>
        </nav>
      </div>
    </header>
  )
}


