import { formatHashComputation } from '../../../algorithms/hashTableShared'
import type { AlgorithmHashTableSnapshot } from '../../../types/algorithmStep'

export type HashTableCaptionContent = {
  title: string
  detail: string
  keyLabel?: string
  bucketLabel?: string
  collision: boolean
}

function titleForSnapshot(snapshot: AlgorithmHashTableSnapshot): string {
  if (
    (snapshot.operationStatus === 'idle' || !snapshot.operationStatus) &&
    !snapshot.phase
  ) {
    return 'Separate chaining'
  }

  if (
    snapshot.operationStatus === 'comparing' ||
    snapshot.phase === 'compare'
  ) {
    return 'Inspecting an entry'
  }

  if (
    snapshot.operationStatus === 'deleting' ||
    (snapshot.deletingEntryId && snapshot.phase === 'mutate')
  ) {
    return 'Deleting an entry'
  }

  if (snapshot.operationStatus === 'inserting') {
    return 'Inserting an entry'
  }

  if (snapshot.operationStatus === 'updating') {
    return 'Key found'
  }

  if (snapshot.operationStatus === 'found') {
    return 'Key found'
  }

  if (snapshot.operationStatus === 'not-found') {
    return 'Key not found'
  }

  if (
    snapshot.collision &&
    (snapshot.operationStatus === 'scanning-chain' ||
      snapshot.phase === 'traverse' ||
      snapshot.phase === 'select-bucket')
  ) {
    return 'Collision detected'
  }

  if (snapshot.operationStatus === 'hashing' || snapshot.phase === 'hash') {
    return 'Hashing a key'
  }

  if (
    snapshot.operationStatus === 'selecting-bucket' ||
    snapshot.phase === 'select-bucket'
  ) {
    return 'Calculated bucket index'
  }

  if (snapshot.phase === 'mutate' && snapshot.insertingEntryId) {
    return snapshot.searchResult === 'found'
      ? 'Key found'
      : 'Inserting an entry'
  }

  if (snapshot.phase === 'complete') {
    if (snapshot.insertingEntryId) {
      return snapshot.searchResult === 'found'
        ? 'Key found'
        : 'Inserting an entry'
    }

    if (snapshot.searchResult === 'found') {
      return snapshot.operationStatus === 'complete'
        ? 'Deleting an entry'
        : 'Key found'
    }

    if (snapshot.searchResult === 'not-found') {
      return 'Key not found'
    }
  }

  return 'Hashing a key'
}

export function describeHashTableCaption(
  snapshot: AlgorithmHashTableSnapshot | null,
  description?: string,
): HashTableCaptionContent | null {
  if (!snapshot) {
    return null
  }

  const key = snapshot.targetKey ?? snapshot.hashedKey
  const bucket = snapshot.hashValue ?? snapshot.activeBucketIndex
  const hashLine = snapshot.hashComputation
    ? formatHashComputation(snapshot.hashComputation)
    : undefined
  const fallback =
    key !== undefined && bucket !== undefined
      ? `"${key}" → bucket ${bucket}`
      : key
        ? `Key "${key}"`
        : 'Watch the buckets and chains.'

  return {
    title: titleForSnapshot(snapshot),
    detail: description ?? hashLine ?? fallback,
    keyLabel: key,
    bucketLabel: bucket !== undefined ? String(bucket) : undefined,
    collision: Boolean(snapshot.collision),
  }
}
