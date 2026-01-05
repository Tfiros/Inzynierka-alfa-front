import { Card, CardContent } from "@/shared/components/Card"
import EntityMenu from "./EntityMenu"
const EntityCard = (props: {
  title: string
  subtitle?: string
  metaLeft?: string
  id: number
  onEdit: () => void
  onDelete: () => void
}) => {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold">{props.title}</div>
          {props.subtitle && (
            <div className="text-sm opacity-70">{props.subtitle}</div>
          )}
          {props.metaLeft && (
            <div className="text-xs opacity-60 mt-1">{props.metaLeft}</div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm opacity-60">ID: {props.id}</div>
          <EntityMenu onEdit={props.onEdit} onDelete={props.onDelete} />
        </div>
      </CardContent>
    </Card>
  )
}
export default EntityCard
