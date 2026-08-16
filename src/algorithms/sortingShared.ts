import type { AlgorithmMetricTable, AlgorithmSortingSnapshot } from '../types/algorithmStep'
import type { SortingIndexRange, SortingMetrics } from '../types/sorting'

export type SortingAlgorithmState = {
  values: number[]
  sortedIndices: number[]
  metrics: SortingMetrics
}

export type SortingSnapshotHighlights = {
  comparedIndices?: number[]
  swappedIndices?: number[]
  writtenIndices?: number[]
  pivotIndex?: number
  activeRanges?: SortingIndexRange[]
}

function copyIndexList(values?: number[]) {
  return values ? [...values] : undefined
}

function copyRanges(ranges?: SortingIndexRange[]) {
  return ranges
    ? ranges.map((range) => ({ start: range.start, end: range.end }))
    : undefined
}

export function createSortingMetrics(): SortingMetrics {
  return {
    comparisons: 0,
    swaps: 0,
    writes: 0,
  }
}

export function copySortingMetrics(metrics: SortingMetrics): SortingMetrics {
  return {
    comparisons: metrics.comparisons,
    swaps: metrics.swaps,
    writes: metrics.writes,
  }
}

export function createSortingState(values: readonly number[]): SortingAlgorithmState {
  return {
    values: [...values],
    sortedIndices: [],
    metrics: createSortingMetrics(),
  }
}

export function recordComparison(state: SortingAlgorithmState) {
  state.metrics.comparisons += 1
}

export function compareValues(
  state: SortingAlgorithmState,
  left: number,
  right: number,
): number {
  recordComparison(state)
  return left - right
}

export function swapValues(
  state: SortingAlgorithmState,
  leftIndex: number,
  rightIndex: number,
) {
  if (leftIndex === rightIndex) {
    return
  }

  const left = state.values[leftIndex]
  state.values[leftIndex] = state.values[rightIndex]
  state.values[rightIndex] = left
  state.metrics.swaps += 1
  state.metrics.writes += 2
}

export function writeValue(
  state: SortingAlgorithmState,
  index: number,
  value: number,
) {
  state.values[index] = value
  state.metrics.writes += 1
}

export function markSorted(state: SortingAlgorithmState, ...indices: number[]) {
  for (const index of indices) {
    if (!state.sortedIndices.includes(index)) {
      state.sortedIndices.push(index)
    }
  }
}

export function markSortedRange(
  state: SortingAlgorithmState,
  start: number,
  end: number,
) {
  for (let index = start; index <= end; index += 1) {
    markSorted(state, index)
  }
}

export function copySortingSnapshot(
  snapshot: AlgorithmSortingSnapshot,
): AlgorithmSortingSnapshot {
  return {
    values: [...snapshot.values],
    metrics: copySortingMetrics(snapshot.metrics),
    comparedIndices: copyIndexList(snapshot.comparedIndices),
    swappedIndices: copyIndexList(snapshot.swappedIndices),
    writtenIndices: copyIndexList(snapshot.writtenIndices),
    pivotIndex: snapshot.pivotIndex,
    activeRanges: copyRanges(snapshot.activeRanges),
    sortedIndices: copyIndexList(snapshot.sortedIndices),
  }
}

export function createSortingSnapshot(
  state: SortingAlgorithmState,
  highlights: SortingSnapshotHighlights = {},
): AlgorithmSortingSnapshot {
  return {
    values: [...state.values],
    metrics: copySortingMetrics(state.metrics),
    comparedIndices: copyIndexList(highlights.comparedIndices),
    swappedIndices: copyIndexList(highlights.swappedIndices),
    writtenIndices: copyIndexList(highlights.writtenIndices),
    pivotIndex: highlights.pivotIndex,
    activeRanges: copyRanges(highlights.activeRanges),
    sortedIndices: [...state.sortedIndices],
  }
}

export function createSortingMetricsTable(
  metrics: SortingMetrics,
): AlgorithmMetricTable {
  return {
    label: 'Metrics',
    columns: ['Metric', 'Count'],
    rows: [
      {
        id: 'comparisons',
        cells: ['Comparisons', String(metrics.comparisons)],
      },
      {
        id: 'swaps',
        cells: ['Swaps', String(metrics.swaps)],
      },
      {
        id: 'writes',
        cells: ['Writes', String(metrics.writes)],
      },
    ],
  }
}
