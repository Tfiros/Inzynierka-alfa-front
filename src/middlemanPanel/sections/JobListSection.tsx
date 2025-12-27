import type {
  MiddlemanJobDto,
  MiddlemanTab,
} from "@/shared/types/middlemanTypes/MiddlemanTypes"
import JobCard from "../components/JobCard"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  tab: MiddlemanTab
  loading: boolean
  error: string | null
  items: MiddlemanJobDto[]

  onAssign: (jobId: string) => void
  onDetails: (jobId: string) => void
  onChangeDate: (jobId: string) => void
  onChangeStatus: (jobId: string) => void
}

const JobsListSection = ({
  tab,
  loading,
  error,
  items,
  onAssign,
  onDetails,
  onChangeDate,
  onChangeStatus,
}: Props) => {
  if (loading) {
    return (
      <div className="mt-6 space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-3 h-4 w-72" />
            <Skeleton className="mt-6 h-24 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-6 rounded-xl border p-6 text-sm text-destructive">
        {error}
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="mt-6 rounded-xl border p-6 text-sm text-muted-foreground">
        Brak ofert do wyświetlenia.
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      {items.map((job) => (
        <JobCard
          key={job.id}
          tab={tab}
          job={job}
          onAssign={onAssign}
          onDetails={onDetails}
          onChangeDate={onChangeDate}
          onChangeStatus={onChangeStatus}
        />
      ))}
    </div>
  )
}
export default JobsListSection
