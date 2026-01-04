import { Card, CardContent } from "@/shared/components/card"
import { Star } from "lucide-react"

export type TestimonialProps = {
  quote: string
  name: string
  role: string
}

export const Testimonial = ({ quote, name, role }: TestimonialProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div
          className="flex items-center justify-center gap-1 text-yellow-500"
          aria-hidden="true"
        >
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
        </div>
        <p className="mt-3 text-sm leading-relaxed">&quot;{quote}&quot;</p>
        <div className="mt-4 text-sm">
          <div className="font-medium">{name}</div>
          <div className="text-muted-foreground">{role}</div>
        </div>
      </CardContent>
    </Card>
  )
}
