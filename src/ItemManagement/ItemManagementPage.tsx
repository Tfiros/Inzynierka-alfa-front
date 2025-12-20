import { useState } from "react"
import TabsSection from "./sections/TabsSection"
import { GenresSection } from "./sections/GenresSection"
import GamesSection from "./sections/GamesSection"
import ItemsSection from "./sections/ItemsSection"

const ItemManagementPage = () => {
  const [tab, setTab] = useState<"genres" | "games" | "items">("genres")

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <div className="text-3xl font-bold">Panel Admina</div>
        <div className="text-sm opacity-70">
          Zarządzaj gatunkami, grami i itemkami
        </div>
      </div>

      <TabsSection value={tab} onChange={(v) => setTab(v as any)} />

      {tab === "genres" && <GenresSection />}
      {tab === "games" && <GamesSection />}
      {tab === "items" && <ItemsSection />}
    </div>
  )
}
export default ItemManagementPage
