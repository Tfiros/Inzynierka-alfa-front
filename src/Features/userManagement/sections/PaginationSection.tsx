import { Button } from "@/shared/components/button"
import { Card, CardContent } from "@/shared/components/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Props = {
  loading: boolean
  page: number
  totalPages: number
  shownFrom: number
  shownTo: number
  totalCount: number
  onPrev: () => void
  onNext: () => void
}

const PaginationSection = (props: Props) => {
  const {
    loading,
    page,
    totalPages,
    shownFrom,
    shownTo,
    totalCount,
    onPrev,
    onNext,
  } = props

  return (
    <Card className="rounded-t-none border-t-0 shadow-sm">
      <CardContent className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-muted-foreground">
          {loading
            ? "—"
            : `Wyświetlanie ${shownFrom}-${shownTo} z ${totalCount} użytkowników`}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={loading || page <= 1}
            onClick={onPrev}
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
          >
            Następna
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PaginationSection
