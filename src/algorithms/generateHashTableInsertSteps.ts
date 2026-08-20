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
  appendHashTableEntry,
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

export function generateHashTableInsertSteps(
  table: HashTableData,
  key: string,
  value: string,
): AlgorithmStep[] {
  const state = createHashTableState(table)
  const steps: AlgorithmStep[] = []
  const computation = createHashComputation(key, state.bucketCount)
  const bucketIndex = computation.bucketIndex
  const auxiliary: AlgorithmAuxiliaryData = {
    label: 'Inserting',
    values: [`${key} → ${value}`],
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
          createHashTableOperationHighlights(computation, {
            targetValue: value,
            ...highlights,
          }),
        ),
        auxiliaryData: auxiliary,
        inspection: extras.inspection,
        pathResult: extras.pathResult,
      }),
    )
  }

  recordHash(state)
  state.currentBucketIndex = bucketIndex
  state.operationStatus = 'idle'

  addStep(
    'hash-table-insert-start',
    `Insert "${key}" with value "${value}".`,
    {
      phase: 'start',
      operationStatus: 'idle',
    },
  )

  state.operationStatus = 'hashing'
  addStep(
    'hash-table-insert-hash',
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
  const collision = chain.some((entryId) => entriesById.get(entryId)?.key !== key)
  state.operationStatus = 'selecting-bucket'

  addStep(
    'hash-table-insert-bucket',
    occupied
      ? `Select bucket ${bucketIndex}. It already holds ${chain.length} ${
          chain.length === 1 ? 'entry' : 'entries'
        }.`
      : `Select bucket ${bucketIndex}. It is empty.`,
    {
      phase: 'select-bucket',
      operationStatus: 'selecting-bucket',
      highlightedEntryIds: chain,
      collision,
    },
    {
      inspection: createHashTableBucketInspection(
        bucketIndex,
        formatHashTableChain(state, bucketIndex),
        occupied,
      ),
    },
  )

  if (collision) {
    recordCollision(state)
    state.operationStatus = 'scanning-chain'
    addStep(
      'hash-table-insert-collision',
      `Collision: bucket ${bucketIndex} already contains another entry. Scan the chain for "${key}".`,
      {
        phase: 'traverse',
        operationStatus: 'scanning-chain',
        highlightedEntryIds: chain,
        collision: true,
      },
      {
        inspection: {
          title: `Collision in bucket ${bucketIndex}`,
          lines: [
            `Bucket ${bucketIndex} is occupied.`,
            `Chain: ${formatHashTableChain(state, bucketIndex)}`,
            `Walk the chain to insert or update "${key}".`,
          ],
        },
      },
    )
  }

  let current: HashTableEntry | undefined = chain[0]
    ? entriesById.get(chain[0])
    : undefined
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
    const pathLabels = getHashTableEntryLabels(
      inspected,
      indexHashTableEntries(state.entries),
    )

    addStep(
      `hash-table-insert-compare-${entry.id}`,
      matched
        ? `Compare "${key}" with "${entry.key}". They match.`
        : `Compare "${key}" with "${entry.key}". They do not match.`,
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
      {
        inspection: createHashTableCompareInspection(key, entry, matched),
      },
    )

    if (matched) {
      const previousValue = entry.value
      entry.value = value
      state.operationStatus = 'updating'

      addStep(
        `hash-table-insert-update-${entry.id}`,
        `Key "${key}" already exists. Update its value from "${previousValue}" to "${value}".`,
        {
          phase: 'mutate',
          operationStatus: 'updating',
          activeEntryId: entry.id,
          foundEntryId: entry.id,
          insertingEntryId: entry.id,
          visitedEntryIds: state.visitedEntryIds,
          collision,
          searchResult: 'found',
        },
        {
          inspection: {
            title: `Update ${entry.key}`,
            lines: [
              `Key ${entry.key}`,
              `Previous value ${previousValue}`,
              `New value ${value}`,
            ],
          },
        },
      )

      state.operationStatus = 'complete'
      addStep(
        'hash-table-insert-complete',
        `Updated "${key}" to "${value}". Bucket ${bucketIndex} is now ${formatHashTableChain(state, bucketIndex)}.`,
        {
          phase: 'complete',
          operationStatus: 'complete',
          activeEntryId: entry.id,
          foundEntryId: entry.id,
          insertingEntryId: entry.id,
          visitedEntryIds: inspected,
          collision,
          searchResult: 'found',
        },
        {
          pathResult: createHashTablePathResult(true, pathLabels, inspected.length),
        },
      )
      return steps
    }

    current = entry.nextId ? entriesById.get(entry.nextId) : undefined
  }

  const inserted = appendHashTableEntry(state, key, value)
  state.currentEntryId = inserted.id
  state.operationStatus = 'inserting'
  const predecessor = inspected[inspected.length - 1]
    ? indexHashTableEntries(state.entries).get(inspected[inspected.length - 1])
    : undefined

  addStep(
    `hash-table-insert-append-${inserted.id}`,
    predecessor
      ? `Append ${describeHashTableEntry(inserted)} after ${describeHashTableEntry(predecessor)} in bucket ${bucketIndex}.`
      : `Place ${describeHashTableEntry(inserted)} as the first entry in bucket ${bucketIndex}.`,
    {
      phase: 'mutate',
      operationStatus: 'inserting',
      activeEntryId: inserted.id,
      insertingEntryId: inserted.id,
      visitedEntryIds: inspected,
      highlightedEntryIds: predecessor ? [predecessor.id] : [],
      collision,
      searchResult: 'not-found',
    },
    {
      inspection: {
        title: `Insert ${inserted.key}`,
        lines: predecessor
          ? [
              `New entry ${describeHashTableEntry(inserted)}`,
              `${describeHashTableEntry(predecessor)}.next → ${describeHashTableEntry(inserted)}`,
            ]
          : [
              `New entry ${describeHashTableEntry(inserted)}`,
              `bucket[${bucketIndex}].head → ${describeHashTableEntry(inserted)}`,
            ],
      },
    },
  )

  state.operationStatus = 'complete'
  addStep(
    'hash-table-insert-complete',
    `Inserted "${key}" with value "${value}". Bucket ${bucketIndex} is now ${formatHashTableChain(state, bucketIndex)}.`,
    {
      phase: 'complete',
      operationStatus: 'complete',
      activeEntryId: inserted.id,
      insertingEntryId: inserted.id,
      visitedEntryIds: inspected,
      collision,
      searchResult: 'not-found',
    },
    {
      pathResult: createHashTablePathResult(
        false,
        getHashTableEntryLabels(
          [...inspected, inserted.id],
          indexHashTableEntries(state.entries),
        ),
        inspected.length,
      ),
    },
  )

  return steps
}
