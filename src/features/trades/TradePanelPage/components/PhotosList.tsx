type PhotosListProps = {
  photos: string[]
}

const PhotosList = ({ photos }: PhotosListProps) => {
  if (!photos.length) {
    return <div className="text-sm text-muted-foreground">Brak zdjęć.</div>
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {photos.map((url, i) => (
        <a
          key={`${url}-${i}`}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="block overflow-hidden rounded-sm border hover:opacity-90"
        >
          <img
            src={url}
            alt={`Zdjęcie ${i + 1}`}
            className="aspect-square w-full object-cover"
          />
        </a>
      ))}
    </div>
  )
}

export default PhotosList
export type { PhotosListProps }
