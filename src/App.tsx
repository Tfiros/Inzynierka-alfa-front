import { lazy, Suspense, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useAppStore } from "./shared/store/appStore"
import AdminRoute from "./routes/AdminRoutes"
import BlankLayout from "./shared/layout/BlankLayout"
import MainLayout from "./shared/layout/MainLayout"
import LandingPage from "./features/landingPage/LandingPage"
import NotFoundPage from "./features/notFoundPage/NotFoundPage"
import { TooltipProvider } from "./shared/components/ui/tooltip"
import { Toaster } from "sonner"
import InteractionHostFallback from "./shared/views/OfferInteractionView/components/InteractionHostFallback"
import ErrorBoundary from "./shared/components/ErrorBoundary"

const FaqsSite = lazy(() => import("./features/faqsPage/faqsSite"))
const ItemManagementPage = lazy(
  () => import("./features/itemManagementPage/ItemManagementPage")
)
const TradePanelPage = lazy(
  () => import("./features/trades/TradePanelPage/TradePanelPage")
)
const PointShop = lazy(() => import("./features/pointShop/pointShop"))
const ProfileEdit = lazy(() => import("./features/profileEditPage/ProfileEdit"))
const SettingsPage = lazy(() => import("./features/settingsPage/SettingsPage"))
const StatutePage = lazy(() => import("./features/statutePage/statutePage"))
const UserManagementPage = lazy(
  () => import("./features/userManagement/UserManagementPage")
)
const ProfilePage = lazy(() => import("./features/profilePage/profilePage"))
const MarketplacePage = lazy(
  () => import("./features/marketplacePage/Marketplace")
)
const ContactPage = lazy(() => import("./features/contactPage/contactPage"))
const InteractionHosts = lazy(
  () => import("./shared/views/OfferInteractionView/InteractionHosts")
)

function App() {
  const initSecurity = useAppStore((s) => s.initSecurity)

  const anyInteractionToMount = useAppStore(
    (s) =>
      s.offerInteractionOpen ||
      s.offerDeleteConfirmOpen ||
      s.counterOfferOpen ||
      s.acceptOfferOpen
  )

  useEffect(() => {
    initSecurity().catch(() => {})
  }, [initSecurity])

  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="faqs" element={<FaqsSite />} />
            <Route path="profile/:id" element={<ProfilePage />} />
            <Route path="statute" element={<StatutePage />} />
            <Route path="shop" element={<PointShop />} />
            <Route path="profileEdit" element={<ProfileEdit />} />
            <Route path="marketplace" element={<MarketplacePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="tradePanel" element={<TradePanelPage />} />

            <Route element={<AdminRoute />}>
              <Route path="userManagement" element={<UserManagementPage />} />
              <Route path="itemManagement" element={<ItemManagementPage />} />
            </Route>
          </Route>

          <Route element={<BlankLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        {anyInteractionToMount && (
          <ErrorBoundary errorMessage="Nie udało się załadować okna. Odśwież stronę">
            <Suspense fallback={<InteractionHostFallback />}>
              <InteractionHosts />
            </Suspense>
          </ErrorBoundary>
        )}
        <Toaster position="bottom-left" richColors />
      </BrowserRouter>
    </TooltipProvider>
  )
}

export default App
