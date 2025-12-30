import { useCallback, useEffect, useMemo, useState } from "react"
import type {
  MiddlemanJobDto,
  MiddlemanStatsDto,
  MiddlemanTab,
} from "@/shared/types/middlemanTypes/MiddlemanTypes"
import { MiddlemanService } from "@/api/services/MiddlemanService"

import HeaderSection from "./sections/HeaderSection"
import StatsSection from "./sections/StatsSection"
import TabsSection from "./sections/TabsSection"
import JobsListSection from "./sections/JobListSection"

const MiddlemanPanelPage = () => {
  const [tab, setTab] = useState<MiddlemanTab>("available")
  const [stats, setStats] = useState<MiddlemanStatsDto | null>(null)
  const [jobs, setJobs] = useState<MiddlemanJobDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [statsRes, jobsRes] = await Promise.all([
        MiddlemanService.getStats(),
        MiddlemanService.getJobs(tab),
      ])

      if (!statsRes.isSuccess || !statsRes.data) {
        setStats(null)
        setError(statsRes.message ?? "Nie udało się pobrać statystyk.")
        return
      }

      if (!jobsRes.isSuccess || !jobsRes.data) {
        setJobs([])
        setError(jobsRes.message ?? "Nie udało się pobrać ofert.")
        setStats(statsRes.data)
        return
      }

      setStats(statsRes.data)
      setJobs(jobsRes.data)
    } catch (e: any) {
      setError(e?.message ?? "Nie udało się pobrać danych.")
    } finally {
      setLoading(false)
    }
  }, [tab])

  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  const counts = useMemo(() => {
    return {
      available: stats?.available ?? 0,
      mine: stats?.mineActive ?? 0,
      finished: stats?.finished ?? 0,
    }
  }, [stats])

  const handleAssign = async (jobId: string) => {
    setError(null)
    const res = await MiddlemanService.assignToMe(jobId)
    if (!res.isSuccess) {
      setError(res.message ?? "Nie udało się przypisać oferty.")
      return
    }
    // po przypisaniu odświeżamy (tab może zostać na available, ale oferta zniknie)
    void fetchAll()
  }

  const handleDetails = (jobId: string) => {
    console.log("details", jobId) // TODO: route do szczegółów
  }

  const handleChangeDate = async (jobId: string) => {
    console.log("change date", jobId) // TODO: otwórz modal i wyślij changeDate
  }

  const handleChangeStatus = async (jobId: string) => {
    console.log("change status", jobId) // TODO: otwórz modal i wyślij changeStatus
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <HeaderSection />

        <StatsSection loading={loading} stats={stats} />

        <TabsSection
          value={tab}
          onChange={setTab}
          availableCount={counts.available}
          mineCount={counts.mine}
          finishedCount={counts.finished}
        />

        <JobsListSection
          tab={tab}
          loading={loading}
          error={error}
          items={jobs}
          onAssign={handleAssign}
          onDetails={handleDetails}
          onChangeDate={handleChangeDate}
          onChangeStatus={handleChangeStatus}
        />
      </div>
    </div>
  )
}

export default MiddlemanPanelPage
