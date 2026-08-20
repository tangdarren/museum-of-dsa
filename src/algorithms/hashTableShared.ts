import type {
  AlgorithmHashTableSnapshot,
  AlgorithmMetricTable,
} from '../types/algorithmStep'
import type {
  HashComputation,
  HashTableAlgorithmState,
  HashTableBucket,
  HashTableData,
  HashTableEntry,
  HashTableMetrics,
  HashTablePair,
} from '../types/hashTable'

export type HashTableSnapshotHighlights = {
  hashComputation?: HashComputation
  hashedKey?: string
  hashValue?: number
  activeBucketIndex?: number
  activeEntryId?: string
  targetKey?: string
  targetValue?: string
  highlightedEntryIds?: string[]
  visitedEntryIds?: string[]
  comparedEntryIds?: string[]
  foundEntryId?: string
  insertingEntryId?: string
  deletingEntryId?: string
  operationStatus?: AlgorithmHashTableSnapshot['operationStatus']
  phase?: AlgorithmHashTableSnapshot['phase']
  searchResult?: AlgorithmHashTableSnapshot['searchResult']
}

function copyIdList(values?: string[]) {
  return values ? [...values] : undefined
}

export function copyHashTableEntry(entry: HashTableEntry): HashTableEntry {
  return {
    id: entry.id,
    key: entry.key,
    value: entry.value,
    nextId: entry.nextId,
  }
}

export function copyHashTableEntries(
  entries: HashTableEntry[],
): HashTableEntry[] {
  return entries.map(copyHashTableEntry)
}

export function copyHashTableBucket(bucket: HashTableBucket): HashTableBucket {
  return {
    index: bucket.index,
    headId: bucket.headId,
  }
}

export function copyHashTableBuckets(
  buckets: HashTableBucket[],
): HashTableBucket[] {
  return buckets.map(copyHashTableBucket)
}

export function copyHashComputation(
  computation: HashComputation,
): HashComputation {
  return {
    key: computation.key,
    characterCodes: [...computation.characterCodes],
    sum: computation.sum,
    bucketCount: computation.bucketCount,
    bucketIndex: computation.bucketIndex,
  }
}

export function createHashTableMetrics(): HashTableMetrics {
  return {
    hashes: 0,
    comparisons: 0,
    visits: 0,
    collisions: 0,
  }
}

export function copyHashTableMetrics(
  metrics: HashTableMetrics,
): HashTableMetrics {
  return {
    hashes: metrics.hashes,
    comparisons: metrics.comparisons,
    visits: metrics.visits,
    collisions: metrics.collisions,
  }
}

export function createHashComputation(
  key: string,
  bucketCount: number,
): HashComputation {
  const characterCodes: number[] = []
  let sum = 0

  for (let index = 0; index < key.length; index += 1) {
    const code = key.charCodeAt(index)
    characterCodes.push(code)
    sum += code
  }

  return {
    key,
    characterCodes,
    sum,
    bucketCount,
    bucketIndex: bucketCount > 0 ? sum % bucketCount : 0,
  }
}

export function hashStringKey(key: string, bucketCount: number): number {
  return createHashComputation(key, bucketCount).bucketIndex
}

export function recordHash(state: HashTableAlgorithmState) {
  state.metrics.hashes += 1
}

export function recordVisit(state: HashTableAlgorithmState) {
  state.metrics.visits += 1
}

export function recordComparison(state: HashTableAlgorithmState) {
  state.metrics.comparisons += 1
}

export function recordCollision(state: HashTableAlgorithmState) {
  state.metrics.collisions += 1
}

export function formatHashComputation(computation: HashComputation): string {
  if (computation.characterCodes.length === 0) {
    return `0 % ${computation.bucketCount} = ${computation.bucketIndex}`
  }

  const codes = computation.characterCodes.join(' + ')
  return `(${codes}) % ${computation.bucketCount} = ${computation.sum} % ${computation.bucketCount} = ${computation.bucketIndex}`
}

export function createEmptyHashTable(bucketCount: number): HashTableData {
  const buckets: HashTableBucket[] = []

  for (let index = 0; index < bucketCount; index += 1) {
    buckets.push({
      index,
      headId: null,
    })
  }

  return {
    bucketCount,
    buckets,
    entries: [],
  }
}

export function createHashTableState(
  table: HashTableData,
): HashTableAlgorithmState {
  return {
    bucketCount: table.bucketCount,
    buckets: copyHashTableBuckets(table.buckets),
    entries: copyHashTableEntries(table.entries),
    visitedEntryIds: [],
    operationStatus: 'idle',
    metrics: createHashTableMetrics(),
  }
}

export function indexHashTableEntries(
  entries: HashTableEntry[],
): Map<string, HashTableEntry> {
  return new Map(entries.map((entry) => [entry.id, entry]))
}

export function getHashTableEntry(
  table: Pick<HashTableData, 'entries'>,
  entryId: string,
): HashTableEntry | undefined {
  return table.entries.find((entry) => entry.id === entryId)
}

export function getHashTableBucket(
  table: Pick<HashTableData, 'buckets'>,
  bucketIndex: number,
): HashTableBucket | undefined {
  return table.buckets.find((bucket) => bucket.index === bucketIndex)
}

export function getHashTableBucketEntryOrder(
  table: HashTableData,
  bucketIndex: number,
): string[] {
  const bucket = getHashTableBucket(table, bucketIndex)

  if (!bucket) {
    return []
  }

  const entriesById = indexHashTableEntries(table.entries)
  const order: string[] = []
  const seen = new Set<string>()
  let currentId = bucket.headId

  while (currentId && !seen.has(currentId)) {
    const entry = entriesById.get(currentId)

    if (!entry) {
      break
    }

    order.push(currentId)
    seen.add(currentId)
    currentId = entry.nextId ?? null
  }

  return order
}

export function getHashTableEntryLabels(
  entryIds: readonly string[],
  entriesById: Map<string, HashTableEntry>,
): string[] {
  return entryIds.map((id) => {
    const entry = entriesById.get(id)
    return entry ? `${entry.key}:${entry.value}` : id
  })
}

export function formatHashTableChain(
  table: HashTableData,
  bucketIndex: number,
): string {
  const order = getHashTableBucketEntryOrder(table, bucketIndex)
  const entriesById = indexHashTableEntries(table.entries)
  const labels = getHashTableEntryLabels(order, entriesById)

  if (labels.length === 0) {
    return 'NULL'
  }

  return `${labels.join(' → ')} → NULL`
}

export function findHashTableEntryByKey(
  table: HashTableData,
  key: string,
): HashTableEntry | undefined {
  const bucketIndex = hashStringKey(key, table.bucketCount)
  const order = getHashTableBucketEntryOrder(table, bucketIndex)
  const entriesById = indexHashTableEntries(table.entries)

  for (const entryId of order) {
    const entry = entriesById.get(entryId)

    if (entry?.key === key) {
      return entry
    }
  }
}

export function createUniqueHashTableEntryId(
  entries: readonly HashTableEntry[],
  key: string,
): string {
  const usedIds = new Set(entries.map((entry) => entry.id))
  const baseId = key

  if (!usedIds.has(baseId)) {
    return baseId
  }

  let suffix = 2
  let candidate = `${baseId}-${suffix}`

  while (usedIds.has(candidate)) {
    suffix += 1
    candidate = `${baseId}-${suffix}`
  }

  return candidate
}

export function createHashTableEntry(
  id: string,
  key: string,
  value: string,
  nextId?: string,
): HashTableEntry {
  const entry: HashTableEntry = {
    id,
    key,
    value,
  }

  if (nextId !== undefined) {
    entry.nextId = nextId
  }

  return entry
}

export function setHashTableNext(
  entry: HashTableEntry,
  nextId: string | undefined,
) {
  if (nextId === undefined) {
    delete entry.nextId
  } else {
    entry.nextId = nextId
  }
}

export function createHashTableFromPairs(
  bucketCount: number,
  pairs: readonly HashTablePair[],
): HashTableData {
  const table = createEmptyHashTable(bucketCount)

  for (const pair of pairs) {
    const existing = findHashTableEntryByKey(table, pair.key)

    if (existing) {
      existing.value = pair.value
      continue
    }

    const entry = createHashTableEntry(
      createUniqueHashTableEntryId(table.entries, pair.key),
      pair.key,
      pair.value,
    )
    const bucketIndex = hashStringKey(pair.key, table.bucketCount)
    const order = getHashTableBucketEntryOrder(table, bucketIndex)

    if (order.length === 0) {
      const bucket = table.buckets[bucketIndex]

      if (bucket) {
        bucket.headId = entry.id
      }
    } else {
      const tail = table.entries.find(
        (item) => item.id === order[order.length - 1],
      )

      if (tail) {
        setHashTableNext(tail, entry.id)
      }
    }

    table.entries.push(entry)
  }

  return table
}

export function copyHashTableSnapshot(
  snapshot: AlgorithmHashTableSnapshot,
): AlgorithmHashTableSnapshot {
  return {
    bucketCount: snapshot.bucketCount,
    buckets: copyHashTableBuckets(snapshot.buckets),
    entries: copyHashTableEntries(snapshot.entries),
    metrics: copyHashTableMetrics(snapshot.metrics),
    hashComputation: snapshot.hashComputation
      ? copyHashComputation(snapshot.hashComputation)
      : undefined,
    hashedKey: snapshot.hashedKey,
    hashValue: snapshot.hashValue,
    activeBucketIndex: snapshot.activeBucketIndex,
    activeEntryId: snapshot.activeEntryId,
    targetKey: snapshot.targetKey,
    targetValue: snapshot.targetValue,
    highlightedEntryIds: copyIdList(snapshot.highlightedEntryIds),
    visitedEntryIds: copyIdList(snapshot.visitedEntryIds),
    comparedEntryIds: copyIdList(snapshot.comparedEntryIds),
    foundEntryId: snapshot.foundEntryId,
    insertingEntryId: snapshot.insertingEntryId,
    deletingEntryId: snapshot.deletingEntryId,
    operationStatus: snapshot.operationStatus,
    phase: snapshot.phase,
    searchResult: snapshot.searchResult,
  }
}

export function createHashTableSnapshot(
  state: HashTableAlgorithmState,
  highlights: HashTableSnapshotHighlights = {},
): AlgorithmHashTableSnapshot {
  return {
    bucketCount: state.bucketCount,
    buckets: copyHashTableBuckets(state.buckets),
    entries: copyHashTableEntries(state.entries),
    metrics: copyHashTableMetrics(state.metrics),
    hashComputation: highlights.hashComputation
      ? copyHashComputation(highlights.hashComputation)
      : undefined,
    hashedKey: highlights.hashedKey,
    hashValue: highlights.hashValue,
    activeBucketIndex: highlights.activeBucketIndex ?? state.currentBucketIndex,
    activeEntryId: highlights.activeEntryId ?? state.currentEntryId,
    targetKey: highlights.targetKey,
    targetValue: highlights.targetValue,
    highlightedEntryIds: copyIdList(highlights.highlightedEntryIds),
    visitedEntryIds: copyIdList(
      highlights.visitedEntryIds ?? state.visitedEntryIds,
    ),
    comparedEntryIds: copyIdList(highlights.comparedEntryIds),
    foundEntryId: highlights.foundEntryId,
    insertingEntryId: highlights.insertingEntryId,
    deletingEntryId: highlights.deletingEntryId,
    operationStatus: highlights.operationStatus ?? state.operationStatus,
    phase: highlights.phase,
    searchResult: highlights.searchResult,
  }
}

export function createHashTableMetricsTable(
  metrics: HashTableMetrics,
): AlgorithmMetricTable {
  return {
    label: 'Metrics',
    columns: ['Metric', 'Count'],
    rows: [
      {
        id: 'hashes',
        cells: ['Hashes', String(metrics.hashes)],
      },
      {
        id: 'visits',
        cells: ['Visits', String(metrics.visits)],
      },
      {
        id: 'comparisons',
        cells: ['Comparisons', String(metrics.comparisons)],
      },
      {
        id: 'collisions',
        cells: ['Collisions', String(metrics.collisions)],
      },
    ],
  }
}
