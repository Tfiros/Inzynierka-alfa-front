import type {
  MiddlemanJobDto,
  MiddlemanTab,
} from "@/shared/types/middlemanTypes/MiddlemanTypes"
import { Card, CardContent } from "@/shared/components/card"
import { ArrowLeftRight } from "lucide-react"
import PartyBlock from "./PartyBlock"
import JobStatusPill from "./JobStatusPill"
import JobActionsAvailable from "./JobActionsAvailable"
import JobActionsMyJob from "./JobActionsMyJob"

type Props = {
  tab: MiddlemanTab
  job: MiddlemanJobDto
  onAssign: (id: string) => void
  onDetails: (id: string) => void
  onChangeDate: (id: string) => void
  onChangeStatus: (id: string) => void
}

const formatCreated = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

const JobCard = ({
  tab,
  job,
  onAssign,
  onDetails,
  onChangeDate,
  onChangeStatus,
}: Props) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">{job.id}</div>
            <div className="text-xs text-muted-foreground">
              Utworzono: {formatCreated(job.createdAt)}
            </div>
          </div>

          <JobStatusPill status={job.status} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_60px_1fr] lg:items-center">
          <PartyBlock party={job.leftParty} />

          <div className="hidden justify-center lg:flex">
            <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <PartyBlock party={job.rightParty} />
        </div>

        {tab === "available" ? (
          <JobActionsAvailable
            feeCoins={job.middlemanFeeCoins}
            onAssign={() => onAssign(job.id)}
          />
        ) : tab === "mine" ? (
          <JobActionsMyJob
            feeCoins={job.middlemanFeeCoins}
            scheduledAt={job.scheduledAt ?? null}
            onDetails={() => onDetails(job.id)}
            onChangeDate={() => onChangeDate(job.id)}
            onChangeStatus={() => onChangeStatus(job.id)}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}
export default JobCard
