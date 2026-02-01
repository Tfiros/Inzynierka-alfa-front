import { Button } from "@/shared/components/button"

type Props = {
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n))

const PaginationSection = ({
  page,
  pageSize,
  totalCount,
  onPageChange,
}: Props) => {
  const totalPages = Math.max(1, Math.ceil((totalCount ?? 0) / (pageSize || 1)))
  const current = clamp(page || 1, 1, totalPages)

  const canPrev = current > 1
  const canNext = current < totalPages

  const goPrev = () => canPrev && onPageChange(current - 1)
  const goNext = () => canNext && onPageChange(current + 1)

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <div className="text-sm text-muted-foreground">
        Strona <span className="text-foreground font-medium">{current}</span> z{" "}
        <span className="text-foreground font-medium">{totalPages}</span> •{" "}
        <span className="text-foreground font-medium">{totalCount ?? 0}</span>{" "}
        wyników
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={goPrev} disabled={!canPrev}>
          Poprzednia
        </Button>
        <Button variant="outline" onClick={goNext} disabled={!canNext}>
          Następna
        </Button>
      </div>
    </div>
  )
}

export default PaginationSection
