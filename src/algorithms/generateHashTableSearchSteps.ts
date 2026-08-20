import type {
  AlgorithmInspection,
  AlgorithmPathResult,
  AlgorithmStep,
} from '../types/algorithmStep'
import type { HashTableData, HashTableEntry } from '../types/hashTable'
import { createHashTableStep } from './createHashTableStep'
import {
  createHashTableBucketInspection,
  createHashTableCompareInspection,
  createHashTableHashInspection,
  createHashTableOperationHighlights,
  createHashTablePathResult,
} from './hashTableOperationShared'
import {
  createHashComputation,
  createHashTableSnapshot,
  createHashTableState,
  formatHashComputation,
  formatHashTableChain,
  getHashTableBucketEntryOrder,
  getHashTableEntryLabels,
  indexHashTableEntries,
  recordCollision,
  recordComparison,
  recordHash,
  recordVisit,
  type HashTableSnapshotHighlights,
} from './hashTableShared'

export function generateHashTableSearchSteps(
  table: HashTableData,
  key: string,
): AlgorithmStep[] {
  const state = createHashTableState(table)
  const steps: AlgorithmStep[] = []
  const computation = createHashComputation(key, state.bucketCount)
  const bucketIndex = computation.bucketIndex
  const inspected: string[] = []

  const pathLabels = () =>
    getHashTableEntryLabels(inspected, indexHashTableEntries(state.entries))

  const addStep = (
    id: string,
    description: string,
    highlights: HashTableSnapshotHighlights = {},
    extras: {
      inspection?: AlgorithmInspection
      pathResult?: AlgorithmPathResult
      auxiliaryValues?: string[]
    } = {},
  ) => {
    steps.push(
      createHashTableStep({
        id,
        description,
        snapshot: createHashTableSnapshot(
          state,
          createHashTableOperationHighlights(computation, highlights),
        ),
        auxiliaryData: {
          label: 'Search key',
          values: extras.auxiliaryValues ?? pathLabels(),
          emphasis: 'last',
        },
        inspection: extras.inspection,
        pathResult: extras.pathResult,
      }),
    )
  }

  const completeSearch = (found: boolean, description: string) => {
    const foundId = found ? inspected[inspected.length - 1] : undefined
    state.operationStatus = found ? 'found' : 'not-found'
    addStep(
      found ? 'hash-table-search-found' : 'hash-table-search-not-found',
      description,
      {
        phase: 'complete',
        operationStatus: found ? 'found' : 'not-found',
        activeEntryId: foundId,
        foundEntryId: foundId,
        visitedEntryIds: inspected.filter((id) => id !== foundId),
        collision: getHashTableBucketEntryOrder(state, bucketIndex).length > 1,
        searchResult: found ? 'found' : 'not-found',
      },
      {
        auxiliaryValues: [],
        pathResult: createHashTablePathResult(
          found,
          pathLabels(),
          inspected.length,
        ),
      },
    )
  }

  recordHash(state)
  state.currentBucketIndex = bucketIndex
  state.operationStatus = 'idle'

  addStep(
    'hash-table-search-start',
    `Search for "${key}".`,
    {
      phase: 'start',
      operationStatus: 'idle',
    },
    { auxiliaryValues: [key] },
  )

  state.operationStatus = 'hashing'
  addStep(
    'hash-table-search-hash',
    `Hash "${key}": ${formatHashComputation(computation)}.`,
    {
      phase: 'hash',
      operationStatus: 'hashing',
    },
    {
      auxiliaryValues: [key],
      inspection: createHashTableHashInspection(computation),
    },
  )

  const chain = getHashTableBucketEntryOrder(state, bucketIndex)
  const entriesById = indexHashTableEntries(state.entries)
  const occupied = chain.length > 0
  const collision = chain.length > 1
  state.operationStatus = 'selecting-bucket'

  addStep(
    'hash-table-search-bucket',
    occupied
      ? `Select bucket ${bucketIndex} and inspect its chain.`
      : `Select bucket ${bucketIndex}. It is empty, so "${key}" is not in the table.`,
    {
      phase: 'select-bucket',
      operationStatus: 'selecting-bucket',
      highlightedEntryIds: chain,
      collision,
      searchResult: occupied ? undefined : 'not-found',
    },
    {
      auxiliaryValues: [key],
      inspection: createHashTableBucketInspection(
        bucketIndex,
        formatHashTableChain(state, bucketIndex),
        occupied,
      ),
    },
  )

  if (!occupied) {
    completeSearch(false, `"${key}" was not found.`)
    return steps
  }

  if (collision) {
    recordCollision(state)
  }

  let current: HashTableEntry | undefined = entriesById.get(chain[0])
  const seen = new Set<string>()

  while (current && !seen.has(current.id)) {
    const entry = current
    seen.add(entry.id)
    recordVisit(state)
    recordComparison(state)
    inspected.push(entry.id)
    state.currentEntryId = entry.id
    state.visitedEntryIds = inspected.filter((id) => id !== entry.id)
    state.operationStatus = 'comparing'

    const matched = entry.key === key

    addStep(
      `hash-table-search-compare-${entry.id}`,
      matched
        ? `Inspect ${entry.key}:${entry.value}. The key matches "${key}".`
        : `Inspect ${entry.key}:${entry.value}. The key is not "${key}".`,
      {
        phase: 'compare',
        operationStatus: 'comparing',
        activeEntryId: entry.id,
        comparedEntryIds: [entry.id],
        visitedEntryIds: state.visitedEntryIds,
        foundEntryId: matched ? entry.id : undefined,
        highlightedEntryIds: entry.nextId ? [entry.nextId] : [],
        collision,
        searchResult: matched ? 'found' : undefined,
      },
      { inspection: createHashTableCompareInspection(key, entry, matched) },
    )

    if (matched) {
      completeSearch(true, `Found "${key}" with value "${entry.value}".`)
      return steps
    }

    current = entry.nextId ? entriesById.get(entry.nextId) : undefined
  }

  completeSearch(
    false,
    `Reached the end of bucket ${bucketIndex}. "${key}" is not in the table.`,
  )
  return steps
}
