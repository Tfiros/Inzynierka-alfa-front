import { Settings } from "lucide-react"
import ProfileEditSettingsCard from "./components/ProfileEditSettingsCard"
import AppApperanceCard from "./components/AppApperanceCard"
import AccountCard from "./components/AccountCard"

const SettingsPage = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6" />
            <h1>Ustawienia</h1>
          </div>
          <p className="text-muted-foreground">
            Zarządzaj swoim kontem i preferencjami aplikacji
          </p>
        </div>

        <div className="space-y-6">
          <ProfileEditSettingsCard />
          <AppApperanceCard />
          <AccountCard />
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
