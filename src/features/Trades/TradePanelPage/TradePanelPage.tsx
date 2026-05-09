import TradeDetailsDialog from "./components/TradeDetailsDialog"
import useTradePanel from "./hooks/UseTradePanel"
import FiltersSection from "./sections/FiltersSection"
import HeaderSection from "./sections/HeaderSection"
import PaginationSection from "./sections/PaginationSection"
import StatsSection from "./sections/StatsSection"
import TabsSection from "./sections/TabsSection"
import TradesListSection from "./sections/TradesListSection"
import ConfirmDeleteTradeDialog from "@/shared/components/AlertDialog"
import useSetTradeAsRealised from "./hooks/UseSetTradeAsRealised"
import UseMarkDialog from "./components/UserMarkDialog"
import LinkedTradeDialog from "./components/LinkedTradeDialog"

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
    linkedTrade,
  } = useTradePanel()

  const realised = useSetTradeAsRealised({
    onSuccess: () => {
      void Promise.all([stats.refetchStats(), list.refetchList()])
    },
  })

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
          onCancleTrade={(tradeId) => {
            void cancelation.actions.openFor(tradeId)
          }}
          onCompleteClick={(trade) => {
            realised.actions.openFor(trade)
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

      <LinkedTradeDialog
        open={linkedTrade.state.open}
        loading={linkedTrade.state.loading}
        error={linkedTrade.state.error}
        trade={linkedTrade.state.trade}
        isMiddleman={isMiddleman}
        onOpenChange={(open) => {
          if (!open) linkedTrade.close()
        }}
        onAssign={(tradeId) => {
          assign.assignToMe(tradeId).then(() => linkedTrade.close())
        }}
        onDetails={(trade) => {
          linkedTrade.close()
          void details.actions.openFor(trade)
        }}
        onCancelTrade={(tradeId) => {
          linkedTrade.close()
          void cancelation.actions.openFor(tradeId)
        }}
        onCompleteClick={(trade) => {
          linkedTrade.close()
          realised.actions.openFor(trade)
        }}
      />

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

      <UseMarkDialog
        open={realised.state.open}
        onOpenChange={(o) => {
          if (!o) realised.actions.close()
        }}
        buyer={realised.state.buyer}
        seller={realised.state.seller}
        loading={realised.isLoading}
        onConfirm={realised.actions.confirm}
      />
    </div>
  )
}

export default TradePanelPage
