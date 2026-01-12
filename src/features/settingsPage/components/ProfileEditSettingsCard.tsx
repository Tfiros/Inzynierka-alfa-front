import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/card"
import { User } from "lucide-react"
import { Link } from "react-router-dom"

const ProfileEditSettingsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profil użytkownika
        </CardTitle>
        <CardDescription>Edytuj swoje informacje profilowe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Edycja profilu</p>
            <p className="text-xs text-muted-foreground">
              Zmień ustawienia profilu
            </p>
          </div>
          <Link
            to="/profileEdit"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
         bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <User className="w-4 h-4 mr-2" />
            Edytuj profil
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileEditSettingsCard
