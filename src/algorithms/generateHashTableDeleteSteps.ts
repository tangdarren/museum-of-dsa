import type {
  AlgorithmAuxiliaryData,
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
  describeHashTableEntry,
} from './hashTableOperationShared'
import {
  createHashComputation,
  createHashTableSnapshot,
  createHashTableState,
  dropHashTableEntry,
  formatHashComputation,
  formatHashTableChain,
  getHashTableBucketEntryOrder,
  getHashTableEntryLabels,
  indexHashTableEntries,
  recordCollision,
  recordComparison,
  recordHash,
  recordVisit,
  unlinkHashTableEntry,
  type HashTableSnapshotHighlights,
} from './hashTableShared'

export function generateHashTableDeleteSteps(
  table: HashTableData,
  key: string,
): AlgorithmStep[] {
  const state = createHashTableState(table)
  const steps: AlgorithmStep[] = []
  const computation = createHashComputation(key, state.bucketCount)
  const bucketIndex = computation.bucketIndex
  const auxiliary: AlgorithmAuxiliaryData = {
    label: 'Deleting',
    values: [key],
  }
  const inspected: string[] = []

  const addStep = (
    id: string,
    description: string,
    highlights: HashTableSnapshotHighlights = {},
    extras: {
      inspection?: AlgorithmInspection
      pathResult?: AlgorithmPathResult
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
        auxiliaryData: auxiliary,
        inspection: extras.inspection,
        pathResult: extras.pathResult,
      }),
    )
  }

  const completeDelete = (
    found: boolean,
    description: string,
    highlights: HashTableSnapshotHighlights = {},
    labels: string[] = getHashTableEntryLabels(
      inspected,
      indexHashTableEntries(state.entries),
    ),
  ) => {
    state.operationStatus = found ? 'complete' : 'not-found'
    addStep(
      found ? 'hash-table-delete-complete' : 'hash-table-delete-not-found',
      description,
      {
        phase: 'complete',
        operationStatus: found ? 'complete' : 'not-found',
        visitedEntryIds: inspected,
        collision: highlights.collision,
        searchResult: found ? 'found' : 'not-found',
        ...highlights,
      },
      {
        pathResult: createHashTablePathResult(found, labels, inspected.length),
      },
    )
  }

  recordHash(state)
  state.currentBucketIndex = bucketIndex
  state.operationStatus = 'idle'

  addStep(
    'hash-table-delete-start',
    `Delete "${key}".`,
    {
      phase: 'start',
      operationStatus: 'idle',
    },
  )

  state.operationStatus = 'hashing'
  addStep(
    'hash-table-delete-hash',
    `Hash "${key}": ${formatHashComputation(computation)}.`,
    {
      phase: 'hash',
      operationStatus: 'hashing',
    },
    { inspection: createHashTableHashInspection(computation) },
  )

  const chain = getHashTableBucketEntryOrder(state, bucketIndex)
  const entriesById = indexHashTableEntries(state.entries)
  const occupied = chain.length > 0
  const collision = chain.length > 1
  state.operationStatus = 'selecting-bucket'

  addStep(
    'hash-table-delete-bucket',
    occupied
      ? `Select bucket ${bucketIndex} and scan its chain for "${key}".`
      : `Select bucket ${bucketIndex}. It is empty, so "${key}" is not in the table.`,
    {
      phase: 'select-bucket',
      operationStatus: 'selecting-bucket',
      highlightedEntryIds: chain,
      collision,
      searchResult: occupied ? undefined : 'not-found',
    },
    {
      inspection: createHashTableBucketInspection(
        bucketIndex,
        formatHashTableChain(state, bucketIndex),
        occupied,
      ),
    },
  )

  if (!occupied) {
    completeDelete(false, `"${key}" was not found. The table is unchanged.`, {
      collision: false,
    })
    return steps
  }

  if (collision) {
    recordCollision(state)
  }

  let predecessor: HashTableEntry | undefined
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
    const successor = entry.nextId ? entriesById.get(entry.nextId) : undefined

    addStep(
      `hash-table-delete-compare-${entry.id}`,
      matched
        ? `Inspect ${describeHashTableEntry(entry)}. The key matches "${key}".`
        : `Inspect ${describeHashTableEntry(entry)}. The key is not "${key}".`,
      {
        phase: 'compare',
        operationStatus: 'comparing',
        activeEntryId: entry.id,
        comparedEntryIds: [entry.id],
        visitedEntryIds: state.visitedEntryIds,
        foundEntryId: matched ? entry.id : undefined,
        deletingEntryId: matched ? entry.id : undefined,
        highlightedEntryIds: [
          ...(predecessor ? [predecessor.id] : []),
          ...(successor ? [successor.id] : []),
        ],
        collision,
        searchResult: matched ? 'found' : undefined,
      },
      { inspection: createHashTableCompareInspection(key, entry, matched) },
    )

    if (matched) {
      const remainingBefore = formatHashTableChain(state, bucketIndex)
      unlinkHashTableEntry(state, bucketIndex, entry.id)
      state.operationStatus = 'deleting'

      addStep(
        `hash-table-delete-remove-${entry.id}`,
        predecessor
          ? successor
            ? `Remove ${describeHashTableEntry(entry)} by pointing ${predecessor.key}.next to ${successor.key}.`
            : `Remove ${describeHashTableEntry(entry)} by pointing ${predecessor.key}.next to NULL.`
          : successor
            ? `Remove ${describeHashTableEntry(entry)} by pointing bucket ${bucketIndex} at ${successor.key}.`
            : `Remove ${describeHashTableEntry(entry)} and leave bucket ${bucketIndex} empty.`,
        {
          phase: 'mutate',
          operationStatus: 'deleting',
          activeEntryId: entry.id,
          deletingEntryId: entry.id,
          foundEntryId: entry.id,
          visitedEntryIds: inspected.filter((id) => id !== entry.id),
          highlightedEntryIds: [
            ...(predecessor ? [predecessor.id] : []),
            ...(successor ? [successor.id] : []),
          ],
          collision,
          searchResult: 'found',
        },
        {
          inspection: {
            title: `Remove ${entry.key}`,
            lines: [
              `Previous chain: ${remainingBefore}`,
              predecessor
                ? `${predecessor.key}.next → ${successor ? successor.key : 'NULL'}`
                : `bucket[${bucketIndex}].head → ${successor ? successor.key : 'NULL'}`,
            ],
          },
        },
      )

      const inspectedLabels = getHashTableEntryLabels(
        inspected,
        indexHashTableEntries(state.entries),
      )
      dropHashTableEntry(state, entry.id)
      state.currentEntryId = predecessor?.id ?? successor?.id
      completeDelete(
        true,
        `Deleted "${key}". Bucket ${bucketIndex} is now ${formatHashTableChain(state, bucketIndex)}.`,
        {
          activeEntryId: predecessor?.id ?? successor?.id,
          visitedEntryIds: inspected.filter((id) => id !== entry.id),
          highlightedEntryIds: [
            ...(predecessor ? [predecessor.id] : []),
            ...(successor ? [successor.id] : []),
          ],
          collision:
            getHashTableBucketEntryOrder(state, bucketIndex).length > 1,
        },
        inspectedLabels,
      )
      return steps
    }

    predecessor = entry
    current = successor
  }

  completeDelete(
    false,
    `Reached the end of bucket ${bucketIndex}. "${key}" is not in the table.`,
    { collision },
  )
  return steps
}
