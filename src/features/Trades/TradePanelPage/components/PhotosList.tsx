import { Image as ImageIcon } from "lucide-react"

type PhotosListProps = {
  photos: string[]
}

const PhotosList = ({ photos }: PhotosListProps) => {
  if (!photos.length) {
    return <div className="text-sm text-muted-foreground">Brak zdjęć.</div>
  }

  return (
    <div className="space-y-2">
      {photos.map((url, i) => (
        <a
          key={`${url}-${i}`}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
        >
          <ImageIcon className="h-4 w-4" />
          <span className="truncate">{url}</span>
        </a>
      ))}
    </div>
  )
}

export default PhotosList
export type { PhotosListProps }
