import { Button } from "@/shared/components/Button"

const Paginator = (props: {
  page: number
  totalPages: number
  totalCount: number
  onPrev: () => void
  onNext: () => void
}) => {
  return (
    <div className="flex items-center justify-between gap-3 pt-3">
      <div className="text-sm opacity-70">
        Łącznie: <b>{props.totalCount}</b>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={props.page <= 1}
          onClick={props.onPrev}
        >
          Poprzednia
        </Button>
        <div className="text-sm opacity-70">
          Strona <b>{props.page}</b> / <b>{props.totalPages || 1}</b>
        </div>
        <Button
          variant="outline"
          disabled={
            props.totalPages > 0 ? props.page >= props.totalPages : true
          }
          onClick={props.onNext}
        >
          Następna
        </Button>
      </div>
    </div>
  )
}
export default Paginator
