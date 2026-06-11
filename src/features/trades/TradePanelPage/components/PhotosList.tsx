import React, { memo } from "react"

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

const photosEqual = (p: PhotosListProps, n: PhotosListProps) => {
  if (p.photos.length !== n.photos.length) return false
  for (let i = 0; i < p.photos.length; i++) {
    if (p.photos[i] !== n.photos[i]) return false
  }
  return true
}

export default memo(PhotosList, photosEqual)
export type { PhotosListProps }
