import {
  createHashTableFromPairs,
  createHashTableSnapshot,
  createHashTableState,
  getHashTableBucketEntryOrder,
} from '../algorithms/hashTableShared'
import type { AlgorithmHashTableSnapshot } from '../types/algorithmStep'
import type { HashTableData, HashTablePair } from '../types/hashTable'

export const HASH_TABLE_BUCKET_COUNT = 8

export const SAMPLE_HASH_TABLE_PAIRS: readonly HashTablePair[] = [
  { key: 'cat', value: '3' },
  { key: 'dog', value: '7' },
  { key: 'owl', value: '2' },
  { key: 'ant', value: '1' },
  { key: 'fox', value: '9' },
  { key: 'bat', value: '4' },
  { key: 'rat', value: '8' },
]

export const SAMPLE_HASH_TABLE: HashTableData = createHashTableFromPairs(
  HASH_TABLE_BUCKET_COUNT,
  SAMPLE_HASH_TABLE_PAIRS,
)

export const DEFAULT_HASH_TABLE_SEARCH_KEY = 'owl'
export const MISSING_HASH_TABLE_SEARCH_KEY = 'elk'
export const DEFAULT_HASH_TABLE_INSERT_PAIR: HashTablePair = {
  key: 'elk',
  value: '6',
}
export const DEFAULT_HASH_TABLE_DELETE_KEY = 'owl'
export const HASH_TABLE_KEY_MAX_LENGTH = 10
export const HASH_TABLE_COLLISION_INSERT_PAIR: HashTablePair = {
  key: 'emu',
  value: '5',
}
export const HASH_TABLE_UPDATE_INSERT_PAIR: HashTablePair = {
  key: 'cat',
  value: '99',
}
export const HASH_TABLE_INSERT_SUGGESTIONS: readonly HashTablePair[] = [
  DEFAULT_HASH_TABLE_INSERT_PAIR,
  HASH_TABLE_COLLISION_INSERT_PAIR,
  HASH_TABLE_UPDATE_INSERT_PAIR,
]

export function normalizeHashTableInput(value: string): string {
  return value.trim().slice(0, HASH_TABLE_KEY_MAX_LENGTH)
}

export function isValidHashTableKey(value: string): boolean {
  return normalizeHashTableInput(value).length > 0
}

export function createDefaultHashTable(): HashTableData {
  return createHashTableFromPairs(
    HASH_TABLE_BUCKET_COUNT,
    SAMPLE_HASH_TABLE_PAIRS,
  )
}

export function createSampleHashTableSnapshot(
  table: HashTableData = SAMPLE_HASH_TABLE,
): AlgorithmHashTableSnapshot {
  return createHashTableSnapshot(createHashTableState(table))
}

export function createIdleHashTableSnapshot(
  table: HashTableData = SAMPLE_HASH_TABLE,
): AlgorithmHashTableSnapshot {
  const collidingIds: string[] = []

  for (const bucket of table.buckets) {
    const order = getHashTableBucketEntryOrder(table, bucket.index)

    if (order.length > 1) {
      collidingIds.push(...order)
    }
  }

  return createHashTableSnapshot(createHashTableState(table), {
    highlightedEntryIds: collidingIds,
    collision: collidingIds.length > 0,
  })
}

export function getHashTableSearchKeyGroups(table: HashTableData): {
  present: string[]
  missing: string[]
} {
  const present = table.entries.map((entry) => entry.key)

  return {
    present,
    missing: [MISSING_HASH_TABLE_SEARCH_KEY].filter(
      (key) => !present.includes(key),
    ),
  }
}
