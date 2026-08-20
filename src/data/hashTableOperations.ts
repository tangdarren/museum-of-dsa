import type { AlgorithmDefinition } from '../types/algorithm'

export const HASH_TABLE_OPERATIONS: AlgorithmDefinition[] = [
  {
    id: 'hash-table-insert',
    title: 'Insert',
    category: 'Hash Table',
    shortDescription:
      'Hashes a key to a bucket, then appends a new entry or updates a matching key.',
    explore: [
      'Hash to a bucket',
      'Collisions chain together',
      'Duplicate keys update',
    ],
    complexity: { time: 'O(1)', space: 'O(1)' },
    available: true,
  },
  {
    id: 'hash-table-search',
    title: 'Search',
    category: 'Hash Table',
    shortDescription:
      'Hashes a key to a bucket, then walks that chain until it finds a match or NULL.',
    explore: [
      'Hash to a bucket',
      'Scan the chain',
      'Found or missing keys',
    ],
    complexity: { time: 'O(1)', space: 'O(1)' },
    available: true,
  },
  {
    id: 'hash-table-delete',
    title: 'Delete',
    category: 'Hash Table',
    shortDescription:
      'Hashes a key to a bucket, then unlinks the matching entry if it is there.',
    explore: [
      'Hash to a bucket',
      'Unlink a matching key',
      'Remaining chain stays intact',
    ],
    complexity: { time: 'O(1)', space: 'O(1)' },
    available: true,
  },
]

export function getHashTableExhibitPrimer(category: string): string | undefined {
  if (category !== 'Hash Table') {
    return undefined
  }

  return 'Average insert, search, and delete are O(1). A key hashes to one bucket. If several keys share that bucket, the chain is scanned and those operations take longer.'
}
