import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TabsSection = (props: {
  value: string
  onChange: (v: string) => void
}) => {
  return (
    <Tabs value={props.value} onValueChange={props.onChange}>
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="genres">Gatunki</TabsTrigger>
        <TabsTrigger value="games">Gry</TabsTrigger>
        <TabsTrigger value="items">Itemki</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
export default TabsSection
