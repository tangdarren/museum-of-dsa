import type { AlgorithmHashTableSnapshot } from '../../types/algorithmStep'
import type {
  HashTableBucketState,
  HashTableBucketStates,
  HashTableEntryState,
  HashTableEntryStates,
  HashTableLinkStates,
} from '../../types/hashTable'
import { getHashTableBucketEntryOrder } from '../../algorithms/hashTableShared'

const ENTRY_STATE_PRIORITY: Record<HashTableEntryState, number> = {
  default: 0,
  visited: 1,
  highlighted: 2,
  compared: 3,
  target: 4,
  found: 5,
  active: 6,
  inserting: 7,
  deleting: 8,
}

const BUCKET_STATE_PRIORITY: Record<HashTableBucketState, number> = {
  default: 0,
  hashed: 1,
  active: 2,
  collision: 3,
}

export function hashTableBucketLinkId(bucketIndex: number): string {
  return `bucket:${bucketIndex}`
}

export function hashTableEntryLinkId(entryId: string): string {
  return `entry:${entryId}`
}

function assignEntryState(
  entryStates: HashTableEntryStates,
  entryId: string,
  state: HashTableEntryState,
) {
  const current = entryStates[entryId] ?? 'default'

  if (ENTRY_STATE_PRIORITY[state] >= ENTRY_STATE_PRIORITY[current]) {
    entryStates[entryId] = state
  }
}

function assignBucketState(
  bucketStates: HashTableBucketStates,
  bucketIndex: number,
  state: HashTableBucketState,
) {
  const current = bucketStates[bucketIndex] ?? 'default'

  if (BUCKET_STATE_PRIORITY[state] >= BUCKET_STATE_PRIORITY[current]) {
    bucketStates[bucketIndex] = state
  }
}

export function mapHashTableSnapshotToStates(
  snapshot: AlgorithmHashTableSnapshot | null,
): {
  bucketStates: HashTableBucketStates
  entryStates: HashTableEntryStates
  linkStates: HashTableLinkStates
} {
  if (!snapshot) {
    return {
      bucketStates: {},
      entryStates: {},
      linkStates: {},
    }
  }

  const bucketStates: HashTableBucketStates = {}
  const entryStates: HashTableEntryStates = {}
  const linkStates: HashTableLinkStates = {}
  const activeBucket = snapshot.activeBucketIndex ?? snapshot.hashValue

  if (snapshot.phase === 'hash' || snapshot.operationStatus === 'hashing') {
    if (activeBucket !== undefined) {
      assignBucketState(bucketStates, activeBucket, 'hashed')
    }
  }

  if (activeBucket !== undefined) {
    assignBucketState(bucketStates, activeBucket, 'active')
  }

  if (snapshot.collision && activeBucket !== undefined) {
    assignBucketState(bucketStates, activeBucket, 'collision')
  }

  for (const entryId of snapshot.visitedEntryIds ?? []) {
    assignEntryState(entryStates, entryId, 'visited')
  }

  for (const entryId of snapshot.highlightedEntryIds ?? []) {
    assignEntryState(entryStates, entryId, 'highlighted')
  }

  for (const entryId of snapshot.comparedEntryIds ?? []) {
    assignEntryState(entryStates, entryId, 'compared')
  }

  if (snapshot.foundEntryId) {
    assignEntryState(entryStates, snapshot.foundEntryId, 'found')
  }

  if (snapshot.activeEntryId) {
    assignEntryState(entryStates, snapshot.activeEntryId, 'active')
  }

  if (snapshot.insertingEntryId) {
    assignEntryState(entryStates, snapshot.insertingEntryId, 'inserting')
  }

  if (snapshot.deletingEntryId) {
    assignEntryState(entryStates, snapshot.deletingEntryId, 'deleting')
  }

  for (const bucket of snapshot.buckets) {
    const order = getHashTableBucketEntryOrder(snapshot, bucket.index)
    const headId = order[0]

    if (
      headId &&
      (headId === snapshot.activeEntryId ||
        snapshot.comparedEntryIds?.includes(headId))
    ) {
      linkStates[hashTableBucketLinkId(bucket.index)] = 'active'
    }

    for (const entryId of order) {
      const entry = snapshot.entries.find((item) => item.id === entryId)

      if (
        entry?.nextId &&
        (entry.nextId === snapshot.activeEntryId ||
          snapshot.comparedEntryIds?.includes(entry.nextId))
      ) {
        linkStates[hashTableEntryLinkId(entry.id)] = 'active'
      }
    }
  }

  return {
    bucketStates,
    entryStates,
    linkStates,
  }
}
