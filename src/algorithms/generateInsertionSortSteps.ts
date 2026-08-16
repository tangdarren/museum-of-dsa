import type { AlgorithmAuxiliaryData, AlgorithmStep } from '../types/algorithmStep'
import type { SortingSnapshotHighlights } from './sortingShared'
import { createSortingStep } from './createSortingStep'
import {
  compareValues,
  createSortingSnapshot,
  createSortingState,
  markSorted,
  markSortedRange,
  writeValue,
} from './sortingShared'

export function generateInsertionSortSteps(
  values: readonly number[],
): AlgorithmStep[] {
  const state = createSortingState(values)
  const steps: AlgorithmStep[] = []

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

  if (state.values.length === 0) {
    addStep('insertion-start', 'The array is empty, so it is already sorted.')
    addStep('insertion-complete', 'The array is sorted.')
    return steps
  }

  markSorted(state, 0)

  if (state.values.length === 1) {
    addStep(
      'insertion-start',
      'A single value is already a sorted prefix.',
    )
    addStep('insertion-complete', 'The array is sorted.')
    return steps
  }

  addStep(
    'insertion-start',
    'The first value is already a sorted prefix. Each remaining value will be inserted into place.',
    { activeRanges: [{ start: 0, end: 0 }] },
  )

  for (let index = 1; index < state.values.length; index += 1) {
    const key = state.values[index]
    const inserting: AlgorithmAuxiliaryData = {
      label: 'Inserting',
      values: [String(key)],
    }
    let hole = index

    addStep(
      `insertion-select-${index}`,
      `Insert ${key} into the sorted prefix.`,
      {
        activeRanges: [{ start: 0, end: index }],
      },
      inserting,
    )

    let comparedIndex = index - 1

    while (comparedIndex >= 0) {
      const comparedValue = state.values[comparedIndex]
      const order = compareValues(state, comparedValue, key)
      const compareHighlights: SortingSnapshotHighlights = {
        comparedIndices: [comparedIndex, hole],
        activeRanges: [{ start: 0, end: index }],
      }

      if (order > 0) {
        addStep(
          `insertion-compare-${index}-${comparedIndex}`,
          `Compare ${key} with ${comparedValue}. ${comparedValue} is larger, so it will shift right.`,
          compareHighlights,
          inserting,
        )
        writeValue(state, hole, comparedValue)
        addStep(
          `insertion-shift-${index}-${comparedIndex}`,
          `Shift ${comparedValue} one place to the right.`,
          {
            writtenIndices: [hole],
            activeRanges: [{ start: 0, end: index }],
          },
          inserting,
        )
        hole = comparedIndex
        comparedIndex -= 1
      } else {
        addStep(
          `insertion-compare-${index}-${comparedIndex}`,
          `Compare ${key} with ${comparedValue}. ${key} belongs after ${comparedValue}.`,
          compareHighlights,
          inserting,
        )
        break
      }
    }

    writeValue(state, hole, key)
    markSortedRange(state, 0, index)

    const placeDescription =
      hole === index
        ? `${key} is already in the correct position within the prefix.`
        : hole === 0
          ? `Place ${key} at the start of the array.`
          : `Place ${key} into the opened position.`

    addStep(
      `insertion-place-${index}`,
      placeDescription,
      {
        writtenIndices: [hole],
        activeRanges: [{ start: 0, end: index }],
      },
      inserting,
    )
  }

  addStep('insertion-complete', 'The array is sorted.')

  return steps
}
