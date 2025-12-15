export type PagedResponse<T> = {
  page: number
  pageSize: number
  totalPages: number
  totalCount: number
  items: T[]
}

export type GetItemsQuery = {
  page?: number
  pageSize?: number
}

export type FilteredItems<T> = {
  searchText?: string
  orderBy?: number
  filterData: T
}
