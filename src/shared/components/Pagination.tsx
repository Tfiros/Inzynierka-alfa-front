import { Button } from "@/shared/components/button"
import { Card, CardContent } from "@/shared/components/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/shared/lib/utils"

export type SimplePaginationProps = {
  page: number
  totalPages: number
  totalCount: number
  onPrev: () => void
  onNext: () => void
  className?: string
}

export type DetailedPaginationProps = {
  loading?: boolean
  page: number
  totalPages: number
  shownFrom: number
  shownTo: number
  totalCount: number
  onPrev: () => void
  onNext: () => void
  itemLabel?: string
  className?: string
}

export type UniversalPaginationProps = {
  page: number
  pageSize?: number
  totalCount: number
  onPageChange: (page: number) => void
  loading?: boolean
  className?: string
}

/**
 * SimplePagination - minimalistyczna paginacja z prev/next i numerem strony
 * Używana w: ItemManagementPage
 */
export const SimplePagination = (props: SimplePaginationProps) => {
  const { page, totalPages, totalCount, onPrev, onNext, className } = props

  return (
    <div
      className={cn("flex items-center justify-between gap-3 pt-3", className)}
    >
      <div className="text-sm opacity-70">
        Łącznie: <b>{totalCount}</b>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={onPrev}
          className={page <= 1 ? "" : "cursor-pointer"}
        >
          Poprzednia
        </Button>

        <div className="text-sm opacity-70">
          Strona <b>{page}</b> / <b>{totalPages || 1}</b>
        </div>

        <Button
          variant="outline"
          disabled={totalPages > 0 ? page >= totalPages : true}
          onClick={onNext}
          className={
            totalPages > 0 && page < totalPages ? "cursor-pointer" : ""
          }
        >
          Następna
        </Button>
      </div>
    </div>
  )
}

/**
 * DetailedPagination - paginacja z informacją o zakresie wyświetlanych elementów
 * Używana w: UserManagementPage, TradePanelPage
 */
export const DetailedPagination = (props: DetailedPaginationProps) => {
  const {
    loading = false,
    page,
    totalPages,
    shownFrom,
    shownTo,
    totalCount,
    onPrev,
    onNext,
    itemLabel = "elementów",
    className,
  } = props

  return (
    <Card className={cn("rounded-t-none border-t-0 shadow-sm", className)}>
      <CardContent className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-muted-foreground">
          {loading
            ? "—"
            : `Wyświetlanie ${shownFrom}-${shownTo} z ${totalCount} ${itemLabel}`}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={loading || page <= 1}
            onClick={onPrev}
            className={loading || page <= 1 ? "" : "cursor-pointer"}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Poprzednia
          </Button>

          <div className="min-w-9 rounded-md border bg-muted/30 px-3 py-1.5 text-center text-sm">
            {page}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={loading || page >= totalPages}
            onClick={onNext}
            className={loading || page >= totalPages ? "" : "cursor-pointer"}
          >
            Następna
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * UniversalPagination - elastyczna paginacja obsługująca onPageChange
 * Używana w: TradePanelPage
 */
export const UniversalPagination = (props: UniversalPaginationProps) => {
  const {
    page,
    pageSize = 10,
    totalCount,
    onPageChange,
    loading = false,
    className,
  } = props

  const totalPages = Math.max(1, Math.ceil((totalCount ?? 0) / (pageSize || 1)))
  const current = Math.max(1, Math.min(page || 1, totalPages))

  const canPrev = current > 1
  const canNext = current < totalPages

  const goPrev = () => canPrev && onPageChange(current - 1)
  const goNext = () => canNext && onPageChange(current + 1)

  return (
    <div
      className={cn(
        "mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row",
        className
      )}
    >
      <div className="text-sm text-muted-foreground">
        Strona <span className="text-foreground font-medium">{current}</span> z{" "}
        <span className="text-foreground font-medium">{totalPages}</span> •{" "}
        <span className="text-foreground font-medium">{totalCount ?? 0}</span>{" "}
        wyników
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={!canPrev || loading}
          className={!canPrev || loading ? "" : "cursor-pointer"}
        >
          Poprzednia
        </Button>

        <Button
          variant="outline"
          onClick={goNext}
          disabled={!canNext || loading}
          className={!canNext || loading ? "" : "cursor-pointer"}
        >
          Następna
        </Button>
      </div>
    </div>
  )
}

export default SimplePagination
