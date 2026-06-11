import { Tabs, TabsList, TabsTrigger } from "@/shared/components/tabs"

const TabsSection = (props: {
  value: string
  onChange: (v: string) => void
}) => {
  return (
    <Tabs value={props.value} onValueChange={props.onChange}>
      <TabsList className="h-auto w-full flex flex-wrap gap-1 md:grid grid-cols-4">
        <TabsTrigger value="genres">Gatunki</TabsTrigger>
        <TabsTrigger value="games">Gry</TabsTrigger>
        <TabsTrigger value="items">Itemki</TabsTrigger>
        <TabsTrigger value="itemRarities">Rzadkości Itemów</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
export default TabsSection
