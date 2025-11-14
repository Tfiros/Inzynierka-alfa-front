import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

const cx = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(' ')

type StatBoxProps = {
  icon: React.ReactNode
  value: React.ReactNode
  label: string
  highlighted?: boolean
}

export const StatBox: React.FC<StatBoxProps> = ({
  icon,
  value,
  label,
  highlighted,
}) => {
  return (
    <Card className={cx('flex-1', highlighted && 'ring-2 ring-primary')}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold leading-none">{value}</div>
          <div className="opacity-60">{icon}</div>
        </div>
        <div className="mt-1 text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  )
}
