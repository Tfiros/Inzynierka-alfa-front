import { cn } from "@/shared/lib/Utils"

type Props = {
  src?: string | null
  alt: string
  size?: "sm" | "md"
  rounded?: "md" | "xl"
}

const Thumb = ({ src = null, alt, size = "md", rounded = "md" }: Props) => {
  const dim = size === "sm" ? "h-7 w-7" : "h-9 w-9"
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
          className="block h-full w-full object-cover"
          loading="lazy"
        />
      ) : null}
    </div>
  )
}

export default Thumb
