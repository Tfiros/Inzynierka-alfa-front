import DarkModeSwitch from "@/shared/components/DarkModeSwitch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/card"
import { Label } from "@/shared/components/label"
import { Sun } from "lucide-react"

const AppApperanceCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="w-5 h-5" />
          Wygląd aplikacji
        </CardTitle>
        <CardDescription>
          Dostosuj motyw i interfejs użytkownika
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="dark-mode" className="text-sm font-medium">
              Tryb ciemny
            </Label>
            <p className="text-xs text-muted-foreground">
              Włącz ciemny motyw interfejsu
            </p>
          </div>
          <div className="[&_*]:cursor-pointer">
            <DarkModeSwitch />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AppApperanceCard
