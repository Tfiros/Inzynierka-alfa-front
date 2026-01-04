import { Input } from "@/components/ui/input"
import { Button } from "@/componentsShared/button"
import type { SecurityFields } from "../components/ProfileSecurityData"
import { TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

type Props = {
  security: SecurityFields | null
  setSecurity: React.Dispatch<React.SetStateAction<SecurityFields | null>>
  savingSecurity: boolean
  onSaveSecurity: () => void
}

export const ProfileSecurityDataSection = ({
  security,
  setSecurity,
  savingSecurity,
  onSaveSecurity,
}: Props) => {
  return (
    <TabsContent value="security" className="space-y-6">
      {!security ? (
        <div className="text-sm text-muted-foreground">
          Brak danych bezpieczeństwa
        </div>
      ) : (
        <>
          <div>
            <Label className="mb-2">E-mail</Label>
            <Input
              value={security.email}
              onChange={(e) =>
                setSecurity((s) => (s ? { ...s, email: e.target.value } : s))
              }
            />
          </div>

          <div>
            <Label className="mb-2">Data urodzenia</Label>
            <Input
              type="date"
              value={security.dateOfBirth}
              onChange={(e) =>
                setSecurity((s) =>
                  s ? { ...s, dateOfBirth: e.target.value } : s
                )
              }
            />
          </div>

          <div className="flex justify-center">
            <Button
              className="gap-2"
              onClick={onSaveSecurity}
              disabled={savingSecurity}
            >
              {savingSecurity ? "Zapisywanie..." : "Zapisz ustawienia"}
            </Button>
          </div>
        </>
      )}
    </TabsContent>
  )
}
