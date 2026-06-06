import { Card, CardContent } from "@/shared/components/card"
import EntityMenu from "./EntityMenu"
const EntityCard = (props: {
  title: string
  subtitle?: string
  metaLeft?: string
  id: number
  thumbnailUrl?: string | null
  onEdit: () => void
  onDelete: () => void
}) => {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={props.thumbnailUrl?.trim() || "/placeholder.png"}
            alt={props.title}
            className="h-12 w-12 rounded-md shrink-0 object-cover bg-muted"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png"
            }}
          />
          <div className="min-w-0">
            <div className="font-semibold">{props.title}</div>
            {props.subtitle && (
              <div className="text-sm opacity-70">{props.subtitle}</div>
            )}
            {props.metaLeft && (
              <div className="text-xs opacity-60 mt-1">{props.metaLeft}</div>
            )}
          </div>
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
