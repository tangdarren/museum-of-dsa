import type {
  AlgorithmAuxiliaryData,
  AlgorithmStep,
} from '../types/algorithmStep'
import type {
  LinkedListData,
  LinkedListNode,
  LinkedListTraversalDirection,
} from '../types/linkedList'
import { createLinkedListStep } from './createLinkedListStep'
import {
  createLinkedListSnapshot,
  createLinkedListState,
  getLinkedListNodeLabels,
  getLinkedListTailId,
  indexLinkedListNodes,
  type LinkedListSnapshotHighlights,
} from './linkedListShared'

function neighborLabel(
  nodeId: string | undefined,
  nodesById: Map<string, LinkedListNode>,
) {
  if (!nodeId) {
    return 'NULL'
  }

  return nodesById.get(nodeId)?.label ?? nodeId
}

export function generateDoublyLinkedListTraverseSteps(
  list: LinkedListData,
  direction: LinkedListTraversalDirection = 'forward',
): AlgorithmStep[] {
  const state = createLinkedListState(list)
  const nodesById = indexLinkedListNodes(state.nodes)
  const steps: AlgorithmStep[] = []
  const visited: string[] = []
  const isForward = direction === 'forward'
  const prefix = isForward
    ? 'doubly-traverse-forward'
    : 'doubly-traverse-backward'
  const startId = isForward ? state.headId : getLinkedListTailId(state)
  const startName = isForward ? 'HEAD' : 'TAIL'
  const followName = isForward ? 'next' : 'previous'

  const addStep = (
    id: string,
    description: string,
    highlights: LinkedListSnapshotHighlights = {},
    auxiliaryValues: string[] = getLinkedListNodeLabels(visited, nodesById),
  ) => {
    const auxiliaryData: AlgorithmAuxiliaryData = {
      label: 'Visited',
      values: auxiliaryValues,
      emphasis: 'last',
    }

    steps.push(
      createLinkedListStep({
        id,
        description,
        snapshot: createLinkedListSnapshot(state, highlights),
        auxiliaryData,
      }),
    )
  }

  if (!startId) {
    addStep(
      `${prefix}-start`,
      `${startName} is NULL, so the list is empty.`,
      { phase: 'start', visitedNodeIds: [] },
      [],
    )
    addStep(
      `${prefix}-null`,
      'The traversal is already at NULL.',
      { phase: 'traverse', visitedNodeIds: [] },
      [],
    )
    addStep(
      `${prefix}-complete`,
      'Traversal complete. Visited 0 nodes.',
      { phase: 'complete', visitedNodeIds: [] },
      [],
    )
    return steps
  }

  const start = nodesById.get(startId)

  if (!start) {
    addStep(
      `${prefix}-start`,
      `${startName} is NULL, so the list is empty.`,
      { phase: 'start', visitedNodeIds: [] },
      [],
    )
    addStep(
      `${prefix}-null`,
      'The traversal is already at NULL.',
      { phase: 'traverse', visitedNodeIds: [] },
      [],
    )
    addStep(
      `${prefix}-complete`,
      'Traversal complete. Visited 0 nodes.',
      { phase: 'complete', visitedNodeIds: [] },
      [],
    )
    return steps
  }

  addStep(
    `${prefix}-start`,
    isForward
      ? `Start at HEAD, which points to ${start.label}. Walk forward with next.`
      : `Start at TAIL, which points to ${start.label}. Walk backward with previous.`,
    {
      phase: 'start',
      currentNodeId: start.id,
      visitedNodeIds: [],
    },
    [],
  )

  let current: LinkedListNode | undefined = start
  const seen = new Set<string>()
  let lastVisited: LinkedListNode | undefined

  while (current && !seen.has(current.id)) {
    const node: LinkedListNode = current
    const followId = isForward ? node.nextId : node.previousId
    seen.add(node.id)
    visited.push(node.id)
    state.visitedNodeIds = [...visited]
    state.metrics.visits += 1
    state.currentNodeId = node.id

    addStep(
      `${prefix}-visit-${node.id}`,
      `Visit ${node.label}. ${followName} points to ${neighborLabel(followId, nodesById)}.`,
      {
        phase: 'traverse',
        currentNodeId: node.id,
        visitedNodeIds: visited.filter((id) => id !== node.id),
        highlightedNodeIds: followId ? [followId] : [],
      },
    )

    lastVisited = node
    current = followId ? nodesById.get(followId) : undefined
  }

  addStep(
    `${prefix}-null`,
    lastVisited
      ? `Follow ${followName} from ${lastVisited.label} and reach NULL.`
      : 'Reached NULL.',
    {
      phase: 'traverse',
      visitedNodeIds: [...visited],
    },
  )
  addStep(
    `${prefix}-complete`,
    `Traversal complete. Visited ${visited.length} node${visited.length === 1 ? '' : 's'}.`,
    {
      phase: 'complete',
      visitedNodeIds: [...visited],
    },
    [],
  )

  return steps
}

export function generateDoublyLinkedListForwardTraverseSteps(
  list: LinkedListData,
): AlgorithmStep[] {
  return generateDoublyLinkedListTraverseSteps(list, 'forward')
}

export function generateDoublyLinkedListBackwardTraverseSteps(
  list: LinkedListData,
): AlgorithmStep[] {
  return generateDoublyLinkedListTraverseSteps(list, 'backward')
}
