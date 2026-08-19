import { useMemo } from 'react'
import { mapLinkedListSnapshotToStates, linkedListLinkId } from '../../algorithms/mapAlgorithmStepToLinkedList'
import { museum } from '../../../theme/palette'
import type { AlgorithmLinkedListSnapshot } from '../../../types/algorithmStep'
import type { Vec3 } from '../../../navigation/destinations'
import LinkedListLink from './LinkedListLink'
import LinkedListMarker from './LinkedListMarker'
import LinkedListNode from './LinkedListNode'
import {
  LINKED_LIST_NEXT_OFFSET_Y,
  LINKED_LIST_PREVIOUS_OFFSET_Y,
  layoutLinkedList,
} from './layoutLinkedList'

type LinkedListVisualizationProps = {
  snapshot: AlgorithmLinkedListSnapshot | null
}

type PointerLink = {
  id: string
  kind: 'next' | 'previous'
  sourcePosition: Vec3
  targetPosition: Vec3
  sourceTrim: number
  targetTrim: number
  offsetY: number
}

function LinkedListVisualization({ snapshot }: LinkedListVisualizationProps) {
  const layout = useMemo(() => layoutLinkedList(snapshot), [snapshot])
  const states = useMemo(
    () => mapLinkedListSnapshotToStates(snapshot),
    [snapshot],
  )
  const links = useMemo(() => {
    if (!snapshot) {
      return [] as PointerLink[]
    }

    const items: PointerLink[] = []
    const nodeTrim = layout.width / 2 + 0.01
    const nullTrim = 0.04

    for (const node of snapshot.nodes) {
      const source = layout.positions.get(node.id)

      if (!source) {
        continue
      }

      if (node.nextId) {
        const target = layout.positions.get(node.nextId)

        if (target) {
          items.push({
            id: linkedListLinkId('next', node.id),
            kind: 'next',
            sourcePosition: source,
            targetPosition: target,
            sourceTrim: nodeTrim,
            targetTrim: nodeTrim,
            offsetY: LINKED_LIST_NEXT_OFFSET_Y,
          })
        }
      } else if (layout.nextNull) {
        items.push({
          id: linkedListLinkId('next', node.id),
          kind: 'next',
          sourcePosition: source,
          targetPosition: layout.nextNull,
          sourceTrim: nodeTrim,
          targetTrim: nullTrim,
          offsetY: LINKED_LIST_NEXT_OFFSET_Y,
        })
      }

      if (snapshot.variant !== 'doubly') {
        continue
      }

      if (node.previousId) {
        const target = layout.positions.get(node.previousId)

        if (target) {
          items.push({
            id: linkedListLinkId('previous', node.id),
            kind: 'previous',
            sourcePosition: source,
            targetPosition: target,
            sourceTrim: nodeTrim,
            targetTrim: nodeTrim,
            offsetY: LINKED_LIST_PREVIOUS_OFFSET_Y,
          })
        }
      } else if (
        layout.previousNull &&
        (node.id === snapshot.headId || node.id === snapshot.insertingNodeId)
      ) {
        items.push({
          id: linkedListLinkId('previous', node.id),
          kind: 'previous',
          sourcePosition: source,
          targetPosition: layout.previousNull,
          sourceTrim: nodeTrim,
          targetTrim: nullTrim,
          offsetY: LINKED_LIST_PREVIOUS_OFFSET_Y,
        })
      }
    }

    if (snapshot.nodes.length === 0 && layout.nextNull) {
      items.push({
        id: 'next:head',
        kind: 'next',
        sourcePosition: [-0.08, 0, 0],
        targetPosition: layout.nextNull,
        sourceTrim: 0.02,
        targetTrim: nullTrim,
        offsetY: LINKED_LIST_NEXT_OFFSET_Y,
      })
    }

    return items
  }, [layout, snapshot])

  const shelfWidth = useMemo(() => {
    const xs = [
      ...layout.positions.values(),
      layout.nextNull,
      layout.previousNull,
    ]
      .filter((value): value is Vec3 => Boolean(value))
      .map((value) => value[0])

    if (xs.length === 0) {
      return 0.8
    }

    return Math.max(0.8, Math.max(...xs) - Math.min(...xs) + layout.width + 0.28)
  }, [layout])

  if (!snapshot) {
    return <group />
  }

  return (
    <group>
      <mesh position={[0, -0.092, 0]} receiveShadow>
        <boxGeometry args={[shelfWidth, 0.016, 0.16]} />
        <meshStandardMaterial
          color={museum.bronze}
          roughness={0.38}
          metalness={0.52}
        />
      </mesh>
      <mesh position={[0, -0.104, 0]} receiveShadow>
        <boxGeometry args={[shelfWidth + 0.08, 0.012, 0.2]} />
        <meshStandardMaterial
          color={museum.stoneDeep}
          roughness={0.8}
          metalness={0.06}
        />
      </mesh>
      {links.map((link) => (
        <LinkedListLink
          key={link.id}
          kind={link.kind}
          sourcePosition={link.sourcePosition}
          targetPosition={link.targetPosition}
          state={states.linkStates[link.id] ?? 'default'}
          sourceTrim={link.sourceTrim}
          targetTrim={link.targetTrim}
          offsetY={link.offsetY}
        />
      ))}
      {snapshot.nodes.map((node) => {
        const position = layout.positions.get(node.id)

        if (!position) {
          return null
        }

        return (
          <LinkedListNode
            key={node.id}
            node={node}
            state={states.nodeStates[node.id] ?? 'default'}
            position={position}
            width={layout.width}
            height={layout.height}
            depth={layout.depth}
            fontSize={layout.fontSize}
          />
        )
      })}
      {layout.headLabel ? (
        <LinkedListMarker
          label="HEAD"
          position={layout.headLabel}
          active={states.headActive}
        />
      ) : null}
      {layout.tailLabel ? (
        <LinkedListMarker
          label="TAIL"
          position={layout.tailLabel}
          active={states.tailActive}
        />
      ) : null}
      {layout.nextNull ? (
        <LinkedListMarker
          label="NULL"
          position={layout.nextNull}
          size="null"
          active={Boolean(
            snapshot.pointerChanges?.some(
              (change) =>
                change.pointer === 'next' && (change.toNodeId ?? null) === null,
            ),
          )}
        />
      ) : null}
      {layout.previousNull ? (
        <LinkedListMarker
          label="NULL"
          position={layout.previousNull}
          size="null"
          active={Boolean(
            snapshot.pointerChanges?.some(
              (change) =>
                change.pointer === 'previous' &&
                (change.toNodeId ?? null) === null,
            ),
          )}
        />
      ) : null}
    </group>
  )
}

export default LinkedListVisualization
