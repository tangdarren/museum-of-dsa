import type { SortingData } from '../types/sorting'

export const SAMPLE_SORTING_DATA: SortingData = {
  values: [6, 2, 8, 4, 7, 1, 5, 3],
}

export const SORTING_ARRAY_SIZE = SAMPLE_SORTING_DATA.values.length
export const SORTING_VALUE_MIN = 1
export const SORTING_VALUE_MAX = 12

function isNonDecreasing(values: number[]) {
  for (let index = 1; index < values.length; index += 1) {
    if (values[index] < values[index - 1]) {
      return false
    }
  }

  return true
}

export function createDefaultSortingValues(): number[] {
  return [...SAMPLE_SORTING_DATA.values]
}

export function createRandomSortingValues(): number[] {
  const span = SORTING_VALUE_MAX - SORTING_VALUE_MIN + 1
  const values = Array.from(
    { length: SORTING_ARRAY_SIZE },
    () => SORTING_VALUE_MIN + Math.floor(Math.random() * span),
  )

  if (values.length > 1 && isNonDecreasing(values)) {
    const index = Math.floor(Math.random() * (values.length - 1))
    const current = values[index]
    values[index + 1] = current
    values[index] =
      current === SORTING_VALUE_MIN ? current + 1 : current - 1
  }

  return values
}

