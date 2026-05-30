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
      {src ? (
        <img
          src={src}
          alt={alt}
          className="block h-full w-full object-contain"
          loading="lazy"
        />
      ) : null}
    </div>
  )
}

export default Thumb
