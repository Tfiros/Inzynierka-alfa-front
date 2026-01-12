import HeaderSection from "./sections/HeaderSection"
import StatsSection from "./sections/StatsSection"
import TabsSection from "./sections/TabsSection"
import FiltersSection from "./sections/FiltersSection"
import TradesListSection from "./sections/TradesListSection"
import PaginationSection from "./sections/PaginationSection"
import useMiddlemanPanel from "./hooks/UseMiddlemanPanel"

const MiddlemanPanelPage = () => {
  const { query, stats, list, assign, counts } = useMiddlemanPanel()

  // spójny błąd do listy (lista ma priorytet, ale assign też może zwrócić)
  const listError = list.errorList ?? assign.assignError ?? null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <HeaderSection />

        <StatsSection loading={stats.loadingStats} stats={stats.stats} />

        <TabsSection
          value={query.state.tab}
          onChange={query.actions.setTab}
          availableCount={counts.available}
          mineCount={counts.mine}
          completedCount={counts.completed}
        />

        <FiltersSection
          tab={query.state.tab}
          state={query.state}
          actions={query.actions}
        />

        <TradesListSection
          tab={list.itemsTab}
          loading={list.loadingList}
          error={listError}
          items={list.items}
          onAssign={assign.assignToMe}
          onDetails={(tradeId) => console.log("details", tradeId)} // TODO: navigate
          // jeśli chcesz blokować przycisk podczas assign:
          // assigning={assign.assigning}
        />

        <PaginationSection
          page={query.state.page}
          pageSize={query.state.pageSize}
          totalCount={list.totalCount}
          onPageChange={query.actions.setPage}
        />
      </div>
    </div>
  )
}

export default MiddlemanPanelPage
