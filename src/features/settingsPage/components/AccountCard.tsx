import { Button } from "@/shared/components/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/card"
import { Trash2, LogOut } from "lucide-react"

const AccountCard = () => {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Zarządzanie kontem
        </CardTitle>
        <CardDescription>Akcje związane z kontem użytkownika</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start">
          <LogOut className="w-4 h-4 mr-2" />
          Wyloguj się
        </Button>

        <Button variant="destructive" className="w-full justify-start">
          <Trash2 className="w-4 h-4 mr-2" />
          Usuń konto
        </Button>
      </CardContent>
    </Card>
  )
}

export default AccountCard
