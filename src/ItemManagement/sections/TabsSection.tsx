import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TabsSection = (props: {
  value: string
  onChange: (v: string) => void
}) => {
  return (
    <Tabs value={props.value} onValueChange={props.onChange}>
      <TabsList className="w-full grid grid-cols-4">
        <TabsTrigger value="genres">Gatunki</TabsTrigger>
        <TabsTrigger value="games">Gry</TabsTrigger>
        <TabsTrigger value="items">Itemki</TabsTrigger>
        <TabsTrigger value="itemRarities">Rzadkości Itemków</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
export default TabsSection
