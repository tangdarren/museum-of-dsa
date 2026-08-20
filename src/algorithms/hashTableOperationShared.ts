import type {
  AlgorithmInspection,
  AlgorithmPathResult,
} from '../types/algorithmStep'
import type { HashComputation, HashTableEntry } from '../types/hashTable'
import {
  formatHashComputation,
  hashTableEntryLabel,
  type HashTableSnapshotHighlights,
} from './hashTableShared'

export function createHashTableHashInspection(
  computation: HashComputation,
): AlgorithmInspection {
  const characterLines =
    computation.characterCodes.length === 0
      ? ['Empty key contributes 0']
      : computation.key.split('').map((character, index) => {
          const code = computation.characterCodes[index]
          return `${character} → ${code}`
        })

  return {
    title: `Hash "${computation.key}"`,
    lines: [
      ...characterLines,
      formatHashComputation(computation),
      `Bucket ${computation.bucketIndex}`,
    ],
  }
}

export function createHashTableBucketInspection(
  bucketIndex: number,
  chainLabel: string,
  occupied: boolean,
): AlgorithmInspection {
  return {
    title: `Bucket ${bucketIndex}`,
    lines: occupied
      ? [`Chain: ${chainLabel}`, `Select bucket ${bucketIndex}.`]
      : [`Bucket ${bucketIndex} is empty.`, 'The chain is NULL.'],
  }
}

export function createHashTableCompareInspection(
  targetKey: string,
  entry: HashTableEntry,
  matched: boolean,
): AlgorithmInspection {
  return {
    title: `Compare with ${entry.key}`,
    lines: [
      `Target ${targetKey}`,
      `Current ${entry.key}`,
      matched
        ? `Equal. "${targetKey}" is at this entry.`
        : `"${targetKey}" is not "${entry.key}". Follow next.`,
    ],
  }
}

export function createHashTableOperationHighlights(
  computation: HashComputation,
  extras: HashTableSnapshotHighlights = {},
): HashTableSnapshotHighlights {
  return {
    hashComputation: computation,
    hashedKey: computation.key,
    hashValue: computation.bucketIndex,
    activeBucketIndex: computation.bucketIndex,
    targetKey: computation.key,
    ...extras,
  }
}

export function createHashTablePathResult(
  found: boolean,
  labels: readonly string[],
  exploredCount: number,
): AlgorithmPathResult {
  return {
    found,
    nodes: [...labels],
    cost: null,
    exploredCount,
  }
}

export function describeHashTableEntry(entry: HashTableEntry): string {
  return hashTableEntryLabel(entry)
}
