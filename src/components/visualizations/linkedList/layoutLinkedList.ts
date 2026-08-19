import type { Vec3 } from '../../../navigation/destinations'
import type { AlgorithmLinkedListSnapshot } from '../../../types/algorithmStep'
import type { LinkedListNode } from '../../../types/linkedList'

export const LINKED_LIST_LAYOUT_WIDTH = 1.78
export const LINKED_LIST_NODE_HEIGHT = 0.118
export const LINKED_LIST_NODE_DEPTH = 0.052
export const LINKED_LIST_NEXT_OFFSET_Y = 0.034
export const LINKED_LIST_PREVIOUS_OFFSET_Y = -0.038

export type LinkedListLayout = {
  positions: Map<string, Vec3>
  width: number
  height: number
  depth: number
  fontSize: number
  headLabel: Vec3 | null
  tailLabel: Vec3 | null
  nextNull: Vec3 | null
  previousNull: Vec3 | null
}

const EMPTY_LAYOUT: LinkedListLayout = {
  positions: new Map(),
  width: 0.13,
  height: LINKED_LIST_NODE_HEIGHT,
  depth: LINKED_LIST_NODE_DEPTH,
  fontSize: 0.048,
  headLabel: [-0.22, 0.16, 0],
  tailLabel: null,
  nextNull: [0.16, 0, 0],
  previousNull: null,
}

function chainOrder(snapshot: AlgorithmLinkedListSnapshot): string[] {
  if (snapshot.nodeOrder && snapshot.nodeOrder.length > 0) {
    return snapshot.nodeOrder.filter((id) =>
      snapshot.nodes.some((node) => node.id === id),
    )
  }

  const nodesById = new Map(snapshot.nodes.map((node) => [node.id, node]))
  const order: string[] = []
  const seen = new Set<string>()
  let currentId = snapshot.headId

  while (currentId && !seen.has(currentId)) {
    if (!nodesById.has(currentId)) {
      break
    }

    order.push(currentId)
    seen.add(currentId)
    currentId = nodesById.get(currentId)?.nextId ?? null
  }

  return order
}

function orphanPosition(
  node: LinkedListNode,
  positions: Map<string, Vec3>,
  spacing: number,
  offsetY: number,
): Vec3 {
  const previous = node.previousId ? positions.get(node.previousId) : undefined
  const next = node.nextId ? positions.get(node.nextId) : undefined

  if (previous && next) {
    return [(previous[0] + next[0]) / 2, offsetY, 0]
  }

  if (previous) {
    return [previous[0] + spacing * 0.55, offsetY, 0]
  }

  if (next) {
    return [next[0] - spacing * 0.55, offsetY, 0]
  }

  return [0, offsetY, 0]
}

export function layoutLinkedList(
  snapshot: AlgorithmLinkedListSnapshot | null,
): LinkedListLayout {
  if (!snapshot) {
    return EMPTY_LAYOUT
  }

  const order = chainOrder(snapshot)
  const isDoubly = snapshot.variant === 'doubly'
  const slotCount = Math.max(1, order.length) + 1
  const spacing = LINKED_LIST_LAYOUT_WIDTH / (slotCount + (isDoubly ? 0.45 : 0.15))
  const width = Math.min(0.15, Math.max(0.1, spacing * 0.46))
  const fontSize = Math.max(0.04, width * 0.36)
  const startX = -((Math.max(order.length, 1) - 1) * spacing) / 2
  const positions = new Map<string, Vec3>()

  order.forEach((id, index) => {
    positions.set(id, [startX + index * spacing, 0, 0])
  })

  for (const node of snapshot.nodes) {
    if (positions.has(node.id)) {
      continue
    }

    const offsetY =
      snapshot.deletingNodeId === node.id
        ? -0.16
        : snapshot.insertingNodeId === node.id
          ? 0.18
          : 0.16
    positions.set(node.id, orphanPosition(node, positions, spacing, offsetY))
  }

  if (order.length === 0) {
    for (const node of snapshot.nodes) {
      const offsetY =
        snapshot.deletingNodeId === node.id
          ? -0.16
          : snapshot.insertingNodeId === node.id
            ? 0.18
            : 0
      positions.set(node.id, [0, offsetY, 0])
    }

    return {
      positions,
      width,
      height: LINKED_LIST_NODE_HEIGHT,
      depth: LINKED_LIST_NODE_DEPTH,
      fontSize,
      headLabel: [-0.22, 0.16, 0],
      tailLabel: isDoubly ? [0.22, 0.16, 0] : null,
      nextNull: [0.16, 0, 0],
      previousNull: isDoubly ? [-0.16, 0, 0] : null,
    }
  }

  const headPosition = snapshot.headId
    ? positions.get(snapshot.headId)
    : undefined
  const tailId = snapshot.tailId ?? order[order.length - 1]
  const tailPosition = tailId ? positions.get(tailId) : undefined
  const lastPosition = positions.get(order[order.length - 1])
  const firstPosition = positions.get(order[0])
  const sameEnds = snapshot.headId !== null && snapshot.headId === tailId

  return {
    positions,
    width,
    height: LINKED_LIST_NODE_HEIGHT,
    depth: LINKED_LIST_NODE_DEPTH,
    fontSize,
    headLabel: headPosition
      ? [headPosition[0] - (sameEnds ? width * 0.42 : 0), 0.168, 0]
      : null,
    tailLabel:
      isDoubly && tailPosition
        ? [tailPosition[0] + (sameEnds ? width * 0.42 : 0), 0.168, 0]
        : null,
    nextNull: lastPosition
      ? [lastPosition[0] + spacing * 0.72, 0, 0]
      : [0.16, 0, 0],
    previousNull:
      isDoubly && firstPosition
        ? [firstPosition[0] - spacing * 0.72, 0, 0]
        : null,
  }
}
