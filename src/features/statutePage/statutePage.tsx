import { useEffect } from "react"
import ContentSection from "./sections/ContentSection"
import HeaderSection from "./sections/HeaderSection"

const StatutePage = () => {
  useEffect(() => window.scrollTo(0, 0), [])

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <HeaderSection />
      <ContentSection />
    </div>
  )
}

export default StatutePage
