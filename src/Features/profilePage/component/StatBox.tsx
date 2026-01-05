import { Card, CardContent } from "@/shared/components/card"

const cx = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ")

type StatBoxProps = {
  icon: React.ReactNode
  value: React.ReactNode
  label: string
  highlighted?: boolean
}

const StatBox = ({ icon, value, label, highlighted }: StatBoxProps) => {
  return (
    <Card className={cx("flex-1", highlighted && "ring-2 ring-primary")}>
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

export default StatBox
