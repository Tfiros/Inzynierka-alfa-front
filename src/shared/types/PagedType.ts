export type PagedResponse<T> = {
  page: number
  pageSize: number
  totalPages: number
  totalCount: number
  elements: T[]
}
