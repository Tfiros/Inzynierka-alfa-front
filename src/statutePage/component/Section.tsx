import React from 'react'
import { Separator } from '@/components/ui/separator'

type SectionProps = {
  title: string
  children: React.ReactNode
}

export const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <section className="scroll-mt-24">
      <h2 className="mb-3 text-xl font-bold tracking-tight">{title}</h2>
      <div className="prose-sm max-w-none text-[15px] leading-7 [&_ol]:space-y-2">
        {children}
      </div>
      <Separator className="my-6" />
    </section>
  )
}
