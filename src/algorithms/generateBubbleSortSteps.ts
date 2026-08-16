import type { AlgorithmStep } from '../types/algorithmStep'
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

export function generateBubbleSortSteps(
  values: readonly number[],
): AlgorithmStep[] {
  const state = createSortingState(values)
  const steps: AlgorithmStep[] = []
  const lastIndex = state.values.length - 1

  const addStep = (
    id: string,
    description: string,
    highlights: SortingSnapshotHighlights = {},
  ) => {
    steps.push(
      createSortingStep({
        id,
        description,
        snapshot: createSortingSnapshot(state, highlights),
      }),
    )
  }

  if (state.values.length === 0) {
    addStep('bubble-start', 'The array is empty, so it is already sorted.')
    addStep('bubble-complete', 'The array is sorted.')
    return steps
  }

  if (state.values.length === 1) {
    markSorted(state, 0)
    addStep('bubble-start', 'A single value is already sorted.')
    addStep('bubble-complete', 'The array is sorted.')
    return steps
  }

  addStep(
    'bubble-start',
    'Start with the unsorted array. Adjacent values will be compared from left to right.',
    { activeRanges: [{ start: 0, end: lastIndex }] },
  )

  for (let pass = 0; pass < lastIndex; pass += 1) {
    let swappedOnPass = false
    const unsortedEnd = lastIndex - pass

    for (let index = 0; index < unsortedEnd; index += 1) {
      const left = state.values[index]
      const right = state.values[index + 1]
      const order = compareValues(state, left, right)
      const highlights: SortingSnapshotHighlights = {
        comparedIndices: [index, index + 1],
        activeRanges: [{ start: 0, end: unsortedEnd }],
      }

      if (order > 0) {
        addStep(
          `bubble-compare-${pass}-${index}`,
          `Compare ${left} and ${right}. They are out of order.`,
          highlights,
        )
        swapValues(state, index, index + 1)
        swappedOnPass = true
        addStep(
          `bubble-swap-${pass}-${index}`,
          `Swap ${left} and ${right}.`,
          {
            swappedIndices: [index, index + 1],
            activeRanges: [{ start: 0, end: unsortedEnd }],
          },
        )
      } else {
        addStep(
          `bubble-compare-${pass}-${index}`,
          `Compare ${left} and ${right}. They are already in order.`,
          highlights,
        )
      }
    }

    markSorted(state, unsortedEnd)

    if (!swappedOnPass || pass === lastIndex - 1) {
      markSortedRange(state, 0, unsortedEnd - 1)
    }

    if (!swappedOnPass) {
      addStep(
        `bubble-placed-${pass}`,
        'No swaps occurred in this pass, so the remaining values are already sorted.',
      )
      break
    }

    addStep(
      `bubble-placed-${pass}`,
      `${state.values[unsortedEnd]} is now in its final position.`,
    )
  }

  markSortedRange(state, 0, lastIndex)
  addStep('bubble-complete', 'The array is sorted.')

  return steps
}
