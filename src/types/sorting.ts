export type SortingData = {
  values: number[]
}

export type SortingValueState =
  | 'default'
  | 'compared'
  | 'swapped'
  | 'written'
  | 'pivot'
  | 'sorted'

export type SortingValueStates = Partial<Record<number, SortingValueState>>

export type SortingIndexRange = {
  start: number
  end: number
}

export type SortingMetrics = {
  comparisons: number
  swaps: number
  writes: number
}
