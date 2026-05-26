export const mapApiList = <T,>(data: unknown): T[] => {
  if (!data) return []
  if (Array.isArray(data)) return data as T[]

  const d = data as any
  if (Array.isArray(d.items)) return d.items as T[]
  if (Array.isArray(d.elements)) return d.elements as T[]

  return []
}

export const mapPagedMeta = (data: unknown) => {
  const d = data as any
  return {
    totalCount: Number(d?.totalCount ?? 0),
    totalPages: Number(d?.totalPages ?? 1),
    page: Number(d?.page ?? 1),
    pageSize: Number(d?.pageSize ?? 10),
  }
}
