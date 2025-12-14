import { Skeleton } from "@/components/ui/skeleton"
import { Users, Calendar, Shield } from "lucide-react"
import type { UserListPagedResponse } from "@/shared/types/userTypes/UserManagementTypes"
import { StatCard } from "../components/StatCard"

type Props = {
  loading: boolean
  data: UserListPagedResponse | null
}

export const StatsSection = ({ loading, data }: Props) => {
  const totalCount = data?.totalCount ?? 0
  const registeredLastMonthCount = data?.registeredLastMonthCount ?? 0
  const middlemenCount = data?.middlemenCount ?? 0

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard
        title="Wszyscy użytkownicy"
        value={loading ? <Skeleton className="h-9 w-16" /> : totalCount}
        subtitle="Łącznie w systemie"
        icon={<Users className="h-4 w-4" />}
      />
      <StatCard
        title="Nowe rejestracje"
        value={
          loading ? <Skeleton className="h-9 w-16" /> : registeredLastMonthCount
        }
        subtitle="W ostatnim miesiącu"
        icon={<Calendar className="h-4 w-4" />}
      />
      <StatCard
        title="Middlemani"
        value={loading ? <Skeleton className="h-9 w-16" /> : middlemenCount}
        subtitle="Aktywni w systemie"
        icon={<Shield className="h-4 w-4" />}
      />
    </div>
  )
}
