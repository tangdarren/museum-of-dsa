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

function mergingAuxiliary(
  left: number[],
  right: number[],
  leftIndex: number,
  rightIndex: number,
): AlgorithmAuxiliaryData {
  const leftRun = left.slice(leftIndex)
  const rightRun = right.slice(rightIndex)

  return {
    label: 'Merging',
    values: [
      `${leftRun.length > 0 ? leftRun.join(', ') : 'empty'} | ${
        rightRun.length > 0 ? rightRun.join(', ') : 'empty'
      }`,
    ],
  }
}

export function generateMergeSortSteps(
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

  const mergeRange = (low: number, mid: number, high: number) => {
    const left = state.values.slice(low, mid + 1)
    const right = state.values.slice(mid + 1, high + 1)
    let leftIndex = 0
    let rightIndex = 0

    addStep(
      `merge-begin-${low}-${high}`,
      'Merge the two sorted halves of this range.',
      {
        activeRanges: [
          { start: low, end: mid },
          { start: mid + 1, end: high },
        ],
      },
      mergingAuxiliary(left, right, leftIndex, rightIndex),
    )

    for (let writeIndex = low; writeIndex <= high; writeIndex += 1) {
      if (leftIndex < left.length && rightIndex < right.length) {
        const leftValue = left[leftIndex]
        const rightValue = right[rightIndex]
        const order = compareValues(state, leftValue, rightValue)
        const leftPosition = low + leftIndex
        const rightPosition = mid + 1 + rightIndex
        const comparedIndices = [
          ...(leftPosition >= writeIndex ? [leftPosition] : []),
          ...(rightPosition >= writeIndex ? [rightPosition] : []),
        ]
        const writtenValue = order <= 0 ? leftValue : rightValue
        const comparison =
          order < 0
            ? `Compare ${leftValue} and ${rightValue}. ${leftValue} is smaller, so it is written next.`
            : order > 0
              ? `Compare ${leftValue} and ${rightValue}. ${rightValue} is smaller, so it is written next.`
              : `Compare ${leftValue} and ${rightValue}. They are equal, so write ${leftValue} from the left half next.`

        addStep(
          `merge-compare-${low}-${high}-${writeIndex}`,
          comparison,
          {
            comparedIndices,
            activeRanges: [{ start: low, end: high }],
          },
          mergingAuxiliary(left, right, leftIndex, rightIndex),
        )

        writeValue(state, writeIndex, writtenValue)

        if (order <= 0) {
          leftIndex += 1
        } else {
          rightIndex += 1
        }

        addStep(
          `merge-write-${low}-${high}-${writeIndex}`,
          `Write ${writtenValue} into the merged range.`,
          {
            writtenIndices: [writeIndex],
            activeRanges: [{ start: low, end: high }],
          },
          mergingAuxiliary(left, right, leftIndex, rightIndex),
        )
        continue
      }

      const remainingValue =
        leftIndex < left.length ? left[leftIndex] : right[rightIndex]
      const remainingSide = leftIndex < left.length ? 'left' : 'right'

      writeValue(state, writeIndex, remainingValue)

      if (leftIndex < left.length) {
        leftIndex += 1
      } else {
        rightIndex += 1
      }

      addStep(
        `merge-write-${low}-${high}-${writeIndex}`,
        `Write ${remainingValue} from the remaining ${remainingSide} half.`,
        {
          writtenIndices: [writeIndex],
          activeRanges: [{ start: low, end: high }],
        },
        mergingAuxiliary(left, right, leftIndex, rightIndex),
      )
    }

    markSortedRange(state, low, high)
    addStep(
      `merge-merged-${low}-${high}`,
      'This range is now merged and sorted.',
      { activeRanges: [{ start: low, end: high }] },
    )
  }

  const sortRange = (low: number, high: number) => {
    if (low === high) {
      markSorted(state, low)
      addStep(
        `merge-single-${low}`,
        `${state.values[low]} is a single-value range, so it is already sorted.`,
        { activeRanges: [{ start: low, end: high }] },
      )
      return
    }

    const mid = Math.floor((low + high) / 2)
    addStep(
      `merge-divide-${low}-${high}`,
      'Divide this range into two smaller ranges.',
      {
        activeRanges: [
          { start: low, end: mid },
          { start: mid + 1, end: high },
        ],
      },
    )

    sortRange(low, mid)
    sortRange(mid + 1, high)
    mergeRange(low, mid, high)
  }

  if (state.values.length === 0) {
    addStep('merge-start', 'The array is empty, so it is already sorted.')
    addStep('merge-complete', 'The array is sorted.')
    return steps
  }

  if (state.values.length === 1) {
    markSorted(state, 0)
    addStep('merge-start', 'A single value is already sorted.')
    addStep('merge-complete', 'The array is sorted.')
    return steps
  }

  addStep(
    'merge-start',
    'Start with the unsorted array. Ranges will be divided, then merged back together.',
    { activeRanges: [{ start: 0, end: lastIndex }] },
  )

  sortRange(0, lastIndex)
  markSortedRange(state, 0, lastIndex)
  addStep('merge-complete', 'The array is sorted.')

  return steps
}
