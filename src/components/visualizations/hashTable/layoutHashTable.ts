import type { Vec3 } from '../../../navigation/destinations'
import { getHashTableBucketEntryOrder } from '../../../algorithms/hashTableShared'
import type { AlgorithmHashTableSnapshot } from '../../../types/algorithmStep'

export const HASH_TABLE_VISUALIZATION_WIDTH = 1.7
export const HASH_TABLE_BUCKET_HEIGHT = 0.068
export const HASH_TABLE_BUCKET_DEPTH = 0.046
export const HASH_TABLE_ENTRY_HEIGHT = 0.084
export const HASH_TABLE_ENTRY_DEPTH = 0.038
export const HASH_TABLE_CHAIN_SPACING = 0.112
export const HASH_TABLE_BUCKET_Y = 0.118
export const HASH_TABLE_CAPTION_Y = 0.3

export type HashTableLayout = {
  bucketCount: number
  totalWidth: number
  columnWidth: number
  bucketWidth: number
  bucketHeight: number
  bucketDepth: number
  entryWidth: number
  entryHeight: number
  entryDepth: number
  fontSize: number
  bucketPositions: Map<number, Vec3>
  entryPositions: Map<string, Vec3>
  nullPositions: Map<number, Vec3>
}

const EMPTY_LAYOUT: HashTableLayout = {
  bucketCount: 0,
  totalWidth: 0,
  columnWidth: 0,
  bucketWidth: 0.12,
  bucketHeight: HASH_TABLE_BUCKET_HEIGHT,
  bucketDepth: HASH_TABLE_BUCKET_DEPTH,
  entryWidth: 0.12,
  entryHeight: HASH_TABLE_ENTRY_HEIGHT,
  entryDepth: HASH_TABLE_ENTRY_DEPTH,
  fontSize: 0.032,
  bucketPositions: new Map(),
  entryPositions: new Map(),
  nullPositions: new Map(),
}

export function hashTableColumnX(
  bucketCount: number,
  bucketIndex: number,
): number {
  if (bucketCount <= 0) {
    return 0
  }

  const spacing = HASH_TABLE_VISUALIZATION_WIDTH / bucketCount
  const startX = -HASH_TABLE_VISUALIZATION_WIDTH / 2 + spacing / 2
  return startX + bucketIndex * spacing
}

function chainY(slot: number): number {
  return HASH_TABLE_BUCKET_Y - HASH_TABLE_CHAIN_SPACING * (slot + 1)
}

export function layoutHashTable(
  snapshot: AlgorithmHashTableSnapshot | null,
): HashTableLayout {
  if (!snapshot || snapshot.bucketCount <= 0) {
    return EMPTY_LAYOUT
  }

  const bucketCount = snapshot.bucketCount
  const spacing = HASH_TABLE_VISUALIZATION_WIDTH / bucketCount
  const bucketWidth = Math.min(0.168, Math.max(0.078, spacing * 0.78))
  const entryWidth = bucketWidth * 0.92
  const fontSize = Math.max(0.026, Math.min(0.036, bucketWidth * 0.24))
  const bucketPositions = new Map<number, Vec3>()
  const entryPositions = new Map<string, Vec3>()
  const nullPositions = new Map<number, Vec3>()

  for (let index = 0; index < bucketCount; index += 1) {
    const x = hashTableColumnX(bucketCount, index)
    bucketPositions.set(index, [x, HASH_TABLE_BUCKET_Y, 0])

    const order = getHashTableBucketEntryOrder(snapshot, index)
    order.forEach((entryId, slot) => {
      entryPositions.set(entryId, [x, chainY(slot), 0])
    })
    nullPositions.set(index, [x, chainY(order.length), 0])
  }

  for (const entry of snapshot.entries) {
    if (entryPositions.has(entry.id)) {
      continue
    }

    const bucketIndex = snapshot.activeBucketIndex ?? snapshot.hashValue ?? 0
    const x = hashTableColumnX(bucketCount, bucketIndex)
    const fallback = nullPositions.get(bucketIndex) ?? [x, chainY(0), 0]
    const drop =
      snapshot.deletingEntryId === entry.id
        ? fallback[1] - 0.046
        : snapshot.insertingEntryId === entry.id
          ? HASH_TABLE_BUCKET_Y + 0.12
          : fallback[1]

    entryPositions.set(entry.id, [x + spacing * 0.16, drop, 0])
  }

  return {
    bucketCount,
    totalWidth: HASH_TABLE_VISUALIZATION_WIDTH,
    columnWidth: spacing,
    bucketWidth,
    bucketHeight: HASH_TABLE_BUCKET_HEIGHT,
    bucketDepth: HASH_TABLE_BUCKET_DEPTH,
    entryWidth,
    entryHeight: HASH_TABLE_ENTRY_HEIGHT,
    entryDepth: HASH_TABLE_ENTRY_DEPTH,
    fontSize,
    bucketPositions,
    entryPositions,
    nullPositions,
  }
}
