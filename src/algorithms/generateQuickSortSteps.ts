import type { AlgorithmAuxiliaryData, AlgorithmStep } from '../types/algorithmStep'
import type { SortingSnapshotHighlights } from './sortingShared'
import { createSortingStep } from './createSortingStep'
import {
  compareValues,
  createSortingSnapshot,
  createSortingState,
  markSorted,
  markSortedRange,
  swapValues,
} from './sortingShared'

export function generateQuickSortSteps(
  values: readonly number[],
): AlgorithmStep[] {
  const state = createSortingState(values)
  const steps: AlgorithmStep[] = []
  const lastIndex = state.values.length - 1

  const addStep = (
    id: string,
    description: string,
    highlights: SortingSnapshotHighlights = {},
    auxiliaryData?: AlgorithmAuxiliaryData,
  ) => {
    steps.push(
      createSortingStep({
        id,
        description,
        snapshot: createSortingSnapshot(state, highlights),
        auxiliaryData,
      }),
    )
  }

  const pivotAuxiliary = (pivot: number): AlgorithmAuxiliaryData => ({
    label: 'Pivot',
    values: [String(pivot)],
  })

  const partitionHighlights = (
    low: number,
    high: number,
    pivotIndex: number,
    extras: SortingSnapshotHighlights = {},
  ): SortingSnapshotHighlights => ({
    pivotIndex,
    activeRanges: [{ start: low, end: high }],
    ...extras,
  })

  const partitionRange = (low: number, high: number): number => {
    const pivotIndex = high
    const pivot = state.values[pivotIndex]
    const auxiliary = pivotAuxiliary(pivot)

    addStep(
      `quick-pivot-${low}-${high}`,
      `Choose ${pivot} as the pivot for this partition.`,
      partitionHighlights(low, high, pivotIndex),
      auxiliary,
    )

    let storeIndex = low

    for (let index = low; index < high; index += 1) {
      const value = state.values[index]
      const order = compareValues(state, value, pivot)
      const comparison =
        order < 0
          ? `Compare ${value} with the pivot ${pivot}. ${value} belongs on the left.`
          : order > 0
            ? `Compare ${value} with the pivot ${pivot}. ${value} belongs on the right.`
            : `Compare ${value} with the pivot ${pivot}. They are equal, so ${value} belongs on the left.`

      addStep(
        `quick-compare-${low}-${high}-${index}`,
        comparison,
        partitionHighlights(low, high, pivotIndex, {
          comparedIndices: [index, pivotIndex],
        }),
        auxiliary,
      )

      if (order <= 0) {
        if (storeIndex !== index) {
          const stored = state.values[storeIndex]
          swapValues(state, storeIndex, index)
          addStep(
            `quick-swap-${low}-${high}-${index}`,
            `Swap ${stored} and ${value} to grow the left side of the partition.`,
            partitionHighlights(low, high, pivotIndex, {
              swappedIndices: [storeIndex, index],
            }),
            auxiliary,
          )
        }

        storeIndex += 1
      }
    }

    if (storeIndex !== high) {
      const stored = state.values[storeIndex]
      swapValues(state, storeIndex, high)
      addStep(
        `quick-swap-pivot-${low}-${high}`,
        `Swap ${stored} and ${pivot} to place the pivot.`,
        partitionHighlights(low, high, storeIndex, {
          swappedIndices: [storeIndex, high],
        }),
        auxiliary,
      )
    }

    return storeIndex
  }

  const sortRange = (low: number, high: number) => {
    if (low > high) {
      return
    }

    if (low === high) {
      markSorted(state, low)
      addStep(
        `quick-single-${low}`,
        `${state.values[low]} is the only value in this partition, so it is already in place.`,
        { activeRanges: [{ start: low, end: high }] },
      )
      return
    }

    const pivotIndex = partitionRange(low, high)
    markSorted(state, pivotIndex)
    addStep(
      `quick-placed-${low}-${high}`,
      `${state.values[pivotIndex]} is now in its final position.`,
      partitionHighlights(low, high, pivotIndex),
      pivotAuxiliary(state.values[pivotIndex]),
    )

    sortRange(low, pivotIndex - 1)
    sortRange(pivotIndex + 1, high)
  }

  if (state.values.length === 0) {
    addStep('quick-start', 'The array is empty, so it is already sorted.')
    addStep('quick-complete', 'The array is sorted.')
    return steps
  }

  if (state.values.length === 1) {
    markSorted(state, 0)
    addStep('quick-start', 'A single value is already sorted.')
    addStep('quick-complete', 'The array is sorted.')
    return steps
  }

  addStep(
    'quick-start',
    'Start with the unsorted array. Each partition will be arranged around a pivot.',
    { activeRanges: [{ start: 0, end: lastIndex }] },
  )

  sortRange(0, lastIndex)
  markSortedRange(state, 0, lastIndex)
  addStep('quick-complete', 'The array is sorted.')

  return steps
}
