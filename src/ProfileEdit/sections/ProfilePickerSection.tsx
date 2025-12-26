import { TabsList, TabsTrigger } from '@radix-ui/react-tabs'

export const ProfilePickerSection: React.FC = () => {
  return (
    <TabsList className="mb-6 grid w-full grid-cols-2">
      <TabsTrigger value="profile">Dane profilu</TabsTrigger>
      <TabsTrigger value="security">Ustawienia bezpieczeństwa</TabsTrigger>
    </TabsList>
  )
}
