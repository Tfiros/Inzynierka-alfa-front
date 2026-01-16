import TradeDetailsDialog from "./components/TradeDetailsDialog"
import useMiddlemanPanel from "./hooks/UseMiddlemanPanel"
import FiltersSection from "./sections/FiltersSection"
import HeaderSection from "./sections/HeaderSection"
import PaginationSection from "./sections/PaginationSection"
import StatsSection from "./sections/StatsSection"
import TabsSection from "./sections/TabsSection"
import TradesListSection from "./sections/TradesListSection"
import ConfirmDeleteTradeDialog from "@/shared/components/AlertDialog"

const TradePanelPage = () => {
  const {
    query,
    stats,
    list,
    assign,
    counts,
    details,
    cancelation,
    isMiddleman,
  } = useMiddlemanPanel()

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
          tab={query.state.tab}
          loading={list.loadingList}
          error={listError}
          items={list.items}
          onAssign={assign.assignToMe}
          onDetails={(trade) => {
            void details.actions.openFor(trade)
          }}
          onCancleTrade={(trade) => {
            void cancelation.actions.openFor(trade)
          }}
          isMiddleman={isMiddleman}
        />

        <PaginationSection
          page={query.state.page}
          pageSize={query.state.pageSize}
          totalCount={list.totalCount}
          onPageChange={query.actions.setPage}
        />
      </div>

      <TradeDetailsDialog
        open={details.state.open}
        loading={details.state.loading}
        error={details.state.error}
        trade={details.state.trade}
        details={details.state.details}
        onOpenChange={(o) => {
          if (!o) details.actions.close()
        }}
        onSaved={details.actions.refresh}
      />

      <ConfirmDeleteTradeDialog
        open={cancelation.open}
        onOpenChange={cancelation.setOpen}
        loading={cancelation.loading}
        onConfirm={cancelation.actions.deleteTrade}
        onClosedReset={cancelation.actions.reset}
      />
    </div>
  )
}

export default TradePanelPage
