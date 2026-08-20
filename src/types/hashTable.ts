export type HashTablePair = {
  key: string
  value: string
}

export type HashTableEntry = {
  id: string
  key: string
  value: string
  nextId?: string
}

export type HashTableBucket = {
  index: number
  headId: string | null
}

export type HashTableData = {
  bucketCount: number
  buckets: HashTableBucket[]
  entries: HashTableEntry[]
}

export type HashTableBucketState = 'default' | 'active' | 'hashed'

export type HashTableEntryState =
  | 'default'
  | 'active'
  | 'visited'
  | 'found'
  | 'target'
  | 'highlighted'
  | 'inserting'
  | 'deleting'
  | 'compared'

export type HashTableBucketStates = Partial<Record<number, HashTableBucketState>>
export type HashTableEntryStates = Partial<Record<string, HashTableEntryState>>

export type HashTableOperationId =
  | 'hash-table-insert'
  | 'hash-table-search'
  | 'hash-table-delete'

export type HashTableOperationPhase =
  | 'start'
  | 'hash'
  | 'select-bucket'
  | 'traverse'
  | 'compare'
  | 'mutate'
  | 'complete'

export type HashTableOperationStatus =
  | 'idle'
  | 'hashing'
  | 'selecting-bucket'
  | 'scanning-chain'
  | 'comparing'
  | 'inserting'
  | 'updating'
  | 'deleting'
  | 'found'
  | 'not-found'
  | 'complete'

export type HashComputation = {
  key: string
  characterCodes: number[]
  sum: number
  bucketCount: number
  bucketIndex: number
}

export type HashTableMetrics = {
  hashes: number
  comparisons: number
  visits: number
  collisions: number
}

export type HashTableAlgorithmState = {
  bucketCount: number
  buckets: HashTableBucket[]
  entries: HashTableEntry[]
  currentBucketIndex?: number
  currentEntryId?: string
  visitedEntryIds: string[]
  operationStatus: HashTableOperationStatus
  metrics: HashTableMetrics
}
