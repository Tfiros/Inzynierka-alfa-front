import { Skeleton } from "../components/skeleton"

const PageFallback = () => {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default PageFallback
