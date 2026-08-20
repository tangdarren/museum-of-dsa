import {
  createHashTableFromPairs,
  createHashTableSnapshot,
  createHashTableState,
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

export function getHashTableSearchKeyGroups(table: HashTableData): {
  present: string[]
  missing: string[]
} {
  return {
    present: table.entries.map((entry) => entry.key),
    missing: [MISSING_HASH_TABLE_SEARCH_KEY],
  }
}
