import { useState } from "react"
import TabsSection from "./sections/TabsSection"
import { GenresTab } from "./sections/GenresTab"
import GamesTab from "./sections/GamesTab"
import ItemsTab from "./sections/ItemsTab"
import ItemRaritiesTab from "./sections/ItemRaritiesTab"

type tabVals = "genres" | "games" | "items" | "itemRarities"

const ItemManagementPage = () => {
  const [tab, setTab] = useState<tabVals>("genres")

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <div className="text-3xl font-bold">Panel Admina</div>
        <div className="text-sm opacity-70">
          Zarządzaj gatunkami, grami i itemkami
        </div>
      </div>

      <TabsSection value={tab} onChange={(v) => setTab(v as tabVals)} />

      {tab === "genres" && <GenresTab />}
      {tab === "games" && <GamesTab />}
      {tab === "items" && <ItemsTab />}
      {tab === "itemRarities" && <ItemRaritiesTab />}
    </div>
  )
}
export default ItemManagementPage
