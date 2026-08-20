import { Text } from '@react-three/drei'
import { useMemo } from 'react'
import { getHashTableBucketEntryOrder } from '../../../algorithms/hashTableShared'
import {
  hashTableBucketLinkId,
  hashTableEntryLinkId,
  mapHashTableSnapshotToStates,
} from '../../algorithms/mapAlgorithmStepToHashTable'
import { museum } from '../../../theme/palette'
import type { AlgorithmHashTableSnapshot } from '../../../types/algorithmStep'
import type { Vec3 } from '../../../navigation/destinations'
import { describeHashTableCaption } from './describeHashTableCaption'
import HashTableBucket from './HashTableBucket'
import HashTableCaption from './HashTableCaption'
import HashTableChainLink from './HashTableChainLink'
import HashTableEntryNode from './HashTableEntryNode'
import { HASH_TABLE_BUCKET_Y, layoutHashTable } from './layoutHashTable'

const HASH_TABLE_BUCKET_SHELF_Y = HASH_TABLE_BUCKET_Y - 0.04

type HashTableVisualizationProps = {
  snapshot: AlgorithmHashTableSnapshot | null
  description?: string
}

type ChainLink = {
  id: string
  sourcePosition: Vec3
  targetPosition: Vec3
  sourceTrim: number
  targetTrim: number
}

function HashTableVisualization({
  snapshot,
  description,
}: HashTableVisualizationProps) {
  const layout = useMemo(() => layoutHashTable(snapshot), [snapshot])
  const states = useMemo(
    () => mapHashTableSnapshotToStates(snapshot),
    [snapshot],
  )
  const caption = useMemo(
    () => describeHashTableCaption(snapshot, description),
    [description, snapshot],
  )
  const links = useMemo(() => {
    if (!snapshot) {
      return [] as ChainLink[]
    }

    const items: ChainLink[] = []
    const bucketTrim = layout.bucketHeight / 2 + 0.006
    const entryTrim = layout.entryHeight / 2 + 0.006
    const nullTrim = 0.03

    for (const bucket of snapshot.buckets) {
      const source = layout.bucketPositions.get(bucket.index)
      const order = getHashTableBucketEntryOrder(snapshot, bucket.index)
      const firstId = order[0]
      const firstPosition = firstId
        ? layout.entryPositions.get(firstId)
        : undefined
      const nullPosition = layout.nullPositions.get(bucket.index)

      if (source && firstPosition) {
        items.push({
          id: hashTableBucketLinkId(bucket.index),
          sourcePosition: source,
          targetPosition: firstPosition,
          sourceTrim: bucketTrim,
          targetTrim: entryTrim,
        })
      } else if (source && nullPosition) {
        items.push({
          id: hashTableBucketLinkId(bucket.index),
          sourcePosition: source,
          targetPosition: nullPosition,
          sourceTrim: bucketTrim,
          targetTrim: nullTrim,
        })
      }

      for (const entry of snapshot.entries) {
        if (!order.includes(entry.id)) {
          continue
        }

        const from = layout.entryPositions.get(entry.id)

        if (!from) {
          continue
        }

        if (entry.nextId) {
          const to = layout.entryPositions.get(entry.nextId)

          if (to) {
            items.push({
              id: hashTableEntryLinkId(entry.id),
              sourcePosition: from,
              targetPosition: to,
              sourceTrim: entryTrim,
              targetTrim: entryTrim,
            })
          }
        } else if (nullPosition) {
          items.push({
            id: hashTableEntryLinkId(entry.id),
            sourcePosition: from,
            targetPosition: nullPosition,
            sourceTrim: entryTrim,
            targetTrim: nullTrim,
          })
        }
      }
    }

    return items
  }, [layout, snapshot])

  if (!snapshot || layout.bucketCount === 0) {
    return <group />
  }

  return (
    <group>
      <mesh position={[0, HASH_TABLE_BUCKET_SHELF_Y, 0]} receiveShadow>
        <boxGeometry args={[layout.totalWidth + 0.12, 0.014, 0.14]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.38}
          metalness={0.52}
        />
      </mesh>
      <mesh position={[0, HASH_TABLE_BUCKET_SHELF_Y - 0.012, 0]} receiveShadow>
        <boxGeometry args={[layout.totalWidth + 0.18, 0.01, 0.18]} />
        <meshStandardMaterial
          color={museum.stoneDeep}
          roughness={0.8}
          metalness={0.06}
        />
      </mesh>
      {caption ? <HashTableCaption content={caption} /> : null}
      {links.map((link) => (
        <HashTableChainLink
          key={link.id}
          sourcePosition={link.sourcePosition}
          targetPosition={link.targetPosition}
          state={states.linkStates[link.id] ?? 'default'}
          sourceTrim={link.sourceTrim}
          targetTrim={link.targetTrim}
        />
      ))}
      {snapshot.buckets.map((bucket) => {
        const position = layout.bucketPositions.get(bucket.index)

        if (!position) {
          return null
        }

        const chained =
          getHashTableBucketEntryOrder(snapshot, bucket.index).length > 1

        return (
          <HashTableBucket
            key={bucket.index}
            index={bucket.index}
            state={states.bucketStates[bucket.index] ?? 'default'}
            chained={chained}
            position={position}
            width={layout.bucketWidth}
            height={layout.bucketHeight}
            depth={layout.bucketDepth}
            fontSize={layout.fontSize}
          />
        )
      })}
      {snapshot.entries.map((entry) => {
        const position = layout.entryPositions.get(entry.id)

        if (!position) {
          return null
        }

        return (
          <HashTableEntryNode
            key={entry.id}
            entry={entry}
            state={states.entryStates[entry.id] ?? 'default'}
            position={position}
            width={layout.entryWidth}
            height={layout.entryHeight}
            depth={layout.entryDepth}
            fontSize={layout.fontSize}
          />
        )
      })}
      {[...layout.nullPositions.entries()].map(([bucketIndex, position]) => (
        <group key={`null-${bucketIndex}`} position={position}>
          <mesh>
            <boxGeometry args={[0.09, 0.042, 0.016]} />
            <meshStandardMaterial
              color={museum.slate}
              emissive={museum.tealDeep}
              emissiveIntensity={0.04}
              roughness={0.52}
              metalness={0.12}
            />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.022}
            color={museum.brassMuted}
            outlineWidth={0.002}
            outlineColor={museum.slateDeep}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.06}
          >
            NULL
          </Text>
        </group>
      ))}
    </group>
  )
}

export default HashTableVisualization
