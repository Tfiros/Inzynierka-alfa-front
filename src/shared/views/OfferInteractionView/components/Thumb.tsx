import { cn } from "@/shared/lib/utils"

type Props = {
  src?: string | null
  alt: string
  size?: "sm" | "md"
}

const Thumb = ({ src = null, alt, size = "md" }: Props) => {
  const dim = size === "sm" ? "h-7 w-7" : "h-10 w-10"
  return (
    <div
      className={cn(
        dim,
        "shrink-0 overflow-hidden rounded-md bg-muted flex items-center justify-center"
      )}
    >
      <img
        src={src?.trim() || "/placeholde.webp"}
        alt={alt}
        className="block h-full w-full object-contain"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.webp"
        }}
      />
    </div>
  )
}

export default Thumb
