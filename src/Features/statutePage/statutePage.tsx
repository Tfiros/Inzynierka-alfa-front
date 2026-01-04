import { useEffect } from "react"
import { HeaderSection } from "./sections/HeaderSection"
import { ContentSection } from "./sections/ContentSection"

export function StatutePage() {
  useEffect(() => window.scrollTo(0, 0), [])

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <HeaderSection />
      <ContentSection />
    </div>
  )
}
