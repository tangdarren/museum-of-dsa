import type { AlgorithmSortingSnapshot } from '../../types/algorithmStep'
import type { SortingValueState } from '../../types/sorting'

const BAR_STATE_PRIORITY: Record<SortingValueState, number> = {
  default: 0,
  active: 1,
  sorted: 2,
  compared: 3,
  written: 4,
  pivot: 5,
}

function assignBarState(
  states: SortingValueState[],
  index: number,
  state: SortingValueState,
) {
  if (index < 0 || index >= states.length) {
    return
  }

  const current = states[index]

  if (BAR_STATE_PRIORITY[state] >= BAR_STATE_PRIORITY[current]) {
    states[index] = state
  }
}

export function mapSortingSnapshotToBarStates(
  snapshot: AlgorithmSortingSnapshot | null,
): SortingValueState[] {
  if (!snapshot) {
    return []
  }

  const states = snapshot.values.map(() => 'default' as SortingValueState)

  for (const range of snapshot.activeRanges ?? []) {
    const start = Math.max(0, range.start)
    const end = Math.min(states.length - 1, range.end)

    for (let index = start; index <= end; index += 1) {
      assignBarState(states, index, 'active')
    }
  }

  for (const index of snapshot.sortedIndices ?? []) {
    assignBarState(states, index, 'sorted')
  }

  for (const index of snapshot.comparedIndices ?? []) {
    assignBarState(states, index, 'compared')
  }

  for (const index of snapshot.swappedIndices ?? []) {
    assignBarState(states, index, 'written')
  }

  for (const index of snapshot.writtenIndices ?? []) {
    assignBarState(states, index, 'written')
  }

  if (snapshot.pivotIndex !== undefined) {
    assignBarState(states, snapshot.pivotIndex, 'pivot')
  }

  return states
}
