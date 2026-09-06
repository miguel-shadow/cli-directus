export interface SortOptions {
  alphanumeric?: boolean
  reverse?: boolean
  type?: 'string' | 'number' | 'date' | 'length'
}

export interface SortObjectsOptions {
  sortKeys: string | string[]
  alphanumeric?: boolean
}
