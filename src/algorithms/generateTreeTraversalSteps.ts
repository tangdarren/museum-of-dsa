import type { AlgorithmAuxiliaryData, AlgorithmStep } from '../types/algorithmStep'
import type { TreeData, TreeNode } from '../types/tree'
import { createTreeStep } from './createTreeStep'
import {
  createTreeSnapshot,
  createTreeState,
  findTreeEdgeId,
  indexTreeNodes,
  type TreeSnapshotHighlights,
} from './treeShared'

export type BinaryTreeTraversalKind = 'preorder' | 'inorder' | 'postorder'

function startDescription(
  kind: BinaryTreeTraversalKind,
  root: TreeNode,
): string {
  if (kind === 'preorder') {
    return `Start at ${root.label}. Preorder visits a node before walking its left and right subtrees.`
  }

  if (kind === 'inorder') {
    return `Start at ${root.label}. Inorder walks the left subtree, visits the node, then walks the right subtree.`
  }

  return `Start at ${root.label}. Postorder walks both subtrees before visiting the node.`
}

function visitDescription(
  kind: BinaryTreeTraversalKind,
  node: TreeNode,
): string {
  if (kind === 'preorder') {
    return `Visit ${node.label}. Preorder records a node before walking its children.`
  }

  if (kind === 'inorder') {
    return `Visit ${node.label}. Inorder records a node after its left subtree.`
  }

  return `Visit ${node.label}. Postorder records a node after both subtrees.`
}

function orderLabels(
  order: readonly string[],
  nodesById: Map<string, TreeNode>,
): string[] {
  return order.map((id) => nodesById.get(id)?.label ?? id)
}

function generateBinaryTreeTraversalSteps(
  tree: TreeData,
  kind: BinaryTreeTraversalKind,
): AlgorithmStep[] {
  const state = createTreeState(tree)
  const nodesById = indexTreeNodes(state.nodes)
  const steps: AlgorithmStep[] = []
  const order: string[] = []
  const path: string[] = []
  const visitedEdges: string[] = []

  const addStep = (
    id: string,
    description: string,
    highlights: TreeSnapshotHighlights = {},
    auxiliaryValues: string[] = orderLabels(order, nodesById),
  ) => {
    const auxiliaryData: AlgorithmAuxiliaryData = {
      label: 'Traversal order',
      values: auxiliaryValues,
      emphasis: 'last',
    }

    steps.push(
      createTreeStep({
        id,
        description,
        snapshot: createTreeSnapshot(state, highlights),
        auxiliaryData,
      }),
    )
  }

  if (!state.rootId) {
    addStep(
      `${kind}-start`,
      'The tree is empty, so the traversal is already complete.',
      {
        visitedNodeIds: [],
        traversalOrder: [],
        pathNodeIds: [],
        activeEdgeIds: [],
        visitedEdgeIds: [],
      },
    )
    addStep(
      `${kind}-complete`,
      'Traversal complete.',
      {
        visitedNodeIds: [],
        traversalOrder: [],
        pathNodeIds: [],
        activeEdgeIds: [],
        visitedEdgeIds: [],
      },
      [],
    )
    return steps
  }

  const root = nodesById.get(state.rootId)

  if (!root) {
    addStep(
      `${kind}-start`,
      'The tree is empty, so the traversal is already complete.',
      {
        visitedNodeIds: [],
        traversalOrder: [],
        pathNodeIds: [],
        activeEdgeIds: [],
        visitedEdgeIds: [],
      },
    )
    addStep(
      `${kind}-complete`,
      'Traversal complete.',
      {
        visitedNodeIds: [],
        traversalOrder: [],
        pathNodeIds: [],
        activeEdgeIds: [],
        visitedEdgeIds: [],
      },
      [],
    )
    return steps
  }

  addStep(`${kind}-start`, startDescription(kind, root), {
    currentNodeId: root.id,
    visitedNodeIds: [],
    traversalOrder: [],
    pathNodeIds: [root.id],
    activeEdgeIds: [],
    visitedEdgeIds: [],
  })

  const visit = (node: TreeNode) => {
    const previous = [...order]
    order.push(node.id)
    state.visitedNodeIds.push(node.id)
    state.metrics.visits += 1
    addStep(`visit-${kind}-${node.id}`, visitDescription(kind, node), {
      currentNodeId: node.id,
      visitedNodeIds: previous,
      traversalOrder: [...order],
      pathNodeIds: [...path],
      activeEdgeIds: [],
      visitedEdgeIds: [...visitedEdges],
    })
  }

  const walk = (nodeId: string, incomingEdgeId?: string) => {
    const node = nodesById.get(nodeId)

    if (!node) {
      return
    }

    path.push(nodeId)
    state.pathNodeIds = [...path]

    const isInitialRoot = nodeId === state.rootId && path.length === 1

    if (!isInitialRoot) {
      addStep(`arrive-${kind}-${nodeId}`, `Arrive at ${node.label}.`, {
        currentNodeId: node.id,
        visitedNodeIds: [...order],
        traversalOrder: [...order],
        pathNodeIds: [...path],
        activeEdgeIds: incomingEdgeId ? [incomingEdgeId] : [],
        visitedEdgeIds: [...visitedEdges],
      })

      if (incomingEdgeId) {
        visitedEdges.push(incomingEdgeId)
      }
    }

    if (kind === 'preorder') {
      visit(node)
    }

    state.metrics.comparisons += 1

    if (node.leftId) {
      const edgeId = findTreeEdgeId(state, node.id, node.leftId)
      walk(node.leftId, edgeId)
      addStep(
        `return-left-${kind}-${node.id}`,
        `Return to ${node.label} after finishing the left subtree.`,
        {
          currentNodeId: node.id,
          visitedNodeIds: [...order],
          traversalOrder: [...order],
          pathNodeIds: [...path],
          activeEdgeIds: [],
          visitedEdgeIds: [...visitedEdges],
        },
      )
    }

    if (kind === 'inorder') {
      visit(node)
    }

    state.metrics.comparisons += 1

    if (node.rightId) {
      const edgeId = findTreeEdgeId(state, node.id, node.rightId)
      walk(node.rightId, edgeId)
      addStep(
        `return-right-${kind}-${node.id}`,
        `Return to ${node.label} after finishing the right subtree.`,
        {
          currentNodeId: node.id,
          visitedNodeIds: [...order],
          traversalOrder: [...order],
          pathNodeIds: [...path],
          activeEdgeIds: [],
          visitedEdgeIds: [...visitedEdges],
        },
      )
    }

    if (kind === 'postorder') {
      visit(node)
    }

    path.pop()
    state.pathNodeIds = [...path]
  }

  walk(root.id)

  addStep(
    `${kind}-complete`,
    'Traversal complete.',
    {
      visitedNodeIds: [...order],
      traversalOrder: [...order],
      pathNodeIds: [],
      activeEdgeIds: [],
      visitedEdgeIds: [...visitedEdges],
    },
    [],
  )

  return steps
}

export function generatePreorderTraversalSteps(
  tree: TreeData,
): AlgorithmStep[] {
  return generateBinaryTreeTraversalSteps(tree, 'preorder')
}

export function generateInorderTraversalSteps(
  tree: TreeData,
): AlgorithmStep[] {
  return generateBinaryTreeTraversalSteps(tree, 'inorder')
}

export function generatePostorderTraversalSteps(
  tree: TreeData,
): AlgorithmStep[] {
  return generateBinaryTreeTraversalSteps(tree, 'postorder')
}
