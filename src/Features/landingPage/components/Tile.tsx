import { Card, CardContent } from "@/shared/components/Card"

export type TileProps = {
  title: string
  description: string
  icon: React.ReactNode
}

const Tile = ({ title, description, icon }: TileProps) => {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border">
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export default Tile
