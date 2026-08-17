import type { Vec3 } from '../../../navigation/destinations'
import type { TreeNode } from '../../../types/tree'

export const TREE_LAYOUT_WIDTH = 1.54
export const TREE_LAYOUT_HEIGHT = 0.94
export const TREE_NODE_RADIUS = 0.072
export const TREE_NODE_MIN_GAP = 0.05

export type BinaryTreeLayout = {
  positions: Map<string, Vec3>
  radius: number
  fontSize: number
}

const EMPTY_LAYOUT: BinaryTreeLayout = {
  positions: new Map(),
  radius: TREE_NODE_RADIUS,
  fontSize: 0.052,
}

function indexNodes(nodes: TreeNode[]): Map<string, TreeNode> {
  return new Map(nodes.map((node) => [node.id, node]))
}

function placeNodes(
  nodeId: string,
  depth: number,
  cursor: { x: number },
  nodesById: Map<string, TreeNode>,
  units: Map<string, { x: number; depth: number }>,
): number {
  const node = nodesById.get(nodeId)

  if (!node) {
    return cursor.x
  }

  const leftX = node.leftId
    ? placeNodes(node.leftId, depth + 1, cursor, nodesById, units)
    : undefined
  const rightX = node.rightId
    ? placeNodes(node.rightId, depth + 1, cursor, nodesById, units)
    : undefined

  let x: number

  if (leftX !== undefined && rightX !== undefined) {
    x = (leftX + rightX) / 2
  } else if (leftX !== undefined) {
    x = leftX
  } else if (rightX !== undefined) {
    x = rightX
  } else {
    x = cursor.x
    cursor.x += 1
  }

  units.set(nodeId, { x, depth })
  return x
}

export function layoutBinaryTree(
  rootId: string | null,
  nodes: TreeNode[],
): BinaryTreeLayout {
  if (!rootId || nodes.length === 0) {
    return EMPTY_LAYOUT
  }

  const nodesById = indexNodes(nodes)
  const units = new Map<string, { x: number; depth: number }>()
  placeNodes(rootId, 0, { x: 0 }, nodesById, units)

  if (units.size === 0) {
    return EMPTY_LAYOUT
  }

  let minX = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxDepth = 0

  for (const unit of units.values()) {
    minX = Math.min(minX, unit.x)
    maxX = Math.max(maxX, unit.x)
    maxDepth = Math.max(maxDepth, unit.depth)
  }

  const contentWidth = Math.max(1, maxX - minX)
  const contentHeight = Math.max(1, maxDepth)
  const horizontalPadding = TREE_NODE_RADIUS * 2 + TREE_NODE_MIN_GAP
  const verticalPadding = TREE_NODE_RADIUS * 2 + TREE_NODE_MIN_GAP
  const availableWidth = TREE_LAYOUT_WIDTH - horizontalPadding
  const availableHeight = TREE_LAYOUT_HEIGHT - verticalPadding
  const scaleX = availableWidth / contentWidth
  const scaleY = availableHeight / contentHeight
  const scale = Math.min(scaleX, scaleY, 0.42)
  const spacing = Math.max(scale, 0.001)
  const levelGap = Math.max(spacing * 0.88, scaleY * 0.9)
  const centerX = (minX + maxX) / 2
  const radius = Math.min(
    TREE_NODE_RADIUS,
    spacing * 0.34,
    levelGap * 0.32,
  )
  const fontSize = Math.max(0.038, radius * 0.74)
  const positions = new Map<string, Vec3>()

  for (const [id, unit] of units) {
    positions.set(id, [
      (unit.x - centerX) * spacing,
      (maxDepth / 2 - unit.depth) * levelGap,
      0,
    ])
  }

  return {
    positions,
    radius,
    fontSize,
  }
}
