import { Button } from "@/shared/components/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/card"
import LogoutButton from "@/shared/components/logoutButton"
import { Trash2 } from "lucide-react"

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
        <div className="pl-3 cursor-pointer [&_*]:cursor-pointer">
          <LogoutButton className="w-full justify-start" />
        </div>

        <Button
          variant="destructive"
          className="w-full justify-start cursor-pointer"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Usuń konto
        </Button>
      </CardContent>
    </Card>
  )
}

export default AccountCard
