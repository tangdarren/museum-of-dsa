import type {
  AlgorithmAuxiliaryData,
  AlgorithmStep,
} from '../types/algorithmStep'
import type { LinkedListData, LinkedListNode } from '../types/linkedList'
import { createLinkedListStep } from './createLinkedListStep'
import {
  createLinkedListSnapshot,
  createLinkedListState,
  getLinkedListNodeLabels,
  indexLinkedListNodes,
  type LinkedListSnapshotHighlights,
} from './linkedListShared'

function nextLabel(
  node: LinkedListNode,
  nodesById: Map<string, LinkedListNode>,
) {
  if (!node.nextId) {
    return 'NULL'
  }

  return nodesById.get(node.nextId)?.label ?? node.nextId
}

export function generateSinglyLinkedListTraverseSteps(
  list: LinkedListData,
): AlgorithmStep[] {
  const state = createLinkedListState(list)
  const nodesById = indexLinkedListNodes(state.nodes)
  const steps: AlgorithmStep[] = []
  const visited: string[] = []

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

  if (!state.headId) {
    addStep(
      'singly-traverse-start',
      'HEAD is NULL, so the list is empty.',
      { phase: 'start', visitedNodeIds: [] },
      [],
    )
    addStep(
      'singly-traverse-null',
      'The traversal is already at NULL.',
      { phase: 'traverse', visitedNodeIds: [] },
      [],
    )
    addStep(
      'singly-traverse-complete',
      'Traversal complete. Visited 0 nodes.',
      { phase: 'complete', visitedNodeIds: [] },
      [],
    )
    return steps
  }

  const head = nodesById.get(state.headId)

  if (!head) {
    addStep(
      'singly-traverse-start',
      'HEAD is NULL, so the list is empty.',
      { phase: 'start', visitedNodeIds: [] },
      [],
    )
    addStep(
      'singly-traverse-null',
      'The traversal is already at NULL.',
      { phase: 'traverse', visitedNodeIds: [] },
      [],
    )
    addStep(
      'singly-traverse-complete',
      'Traversal complete. Visited 0 nodes.',
      { phase: 'complete', visitedNodeIds: [] },
      [],
    )
    return steps
  }

  addStep(
    'singly-traverse-start',
    `Start at HEAD, which points to ${head.label}.`,
    {
      phase: 'start',
      currentNodeId: head.id,
      visitedNodeIds: [],
    },
    [],
  )

  let current: LinkedListNode | undefined = head
  const seen = new Set<string>()
  let lastVisited: LinkedListNode | undefined

  while (current && !seen.has(current.id)) {
    const node: LinkedListNode = current
    seen.add(node.id)
    visited.push(node.id)
    state.visitedNodeIds = [...visited]
    state.metrics.visits += 1
    state.currentNodeId = node.id

    addStep(
      `singly-traverse-visit-${node.id}`,
      `Visit ${node.label}. Next points to ${nextLabel(node, nodesById)}.`,
      {
        phase: 'traverse',
        currentNodeId: node.id,
        visitedNodeIds: visited.filter((id) => id !== node.id),
        highlightedNodeIds: node.nextId ? [node.nextId] : [],
      },
    )

    lastVisited = node
    current = node.nextId ? nodesById.get(node.nextId) : undefined
  }

  addStep(
    'singly-traverse-null',
    lastVisited
      ? `Follow next from ${lastVisited.label} and reach NULL. The list ends here.`
      : 'Reached NULL. The list ends here.',
    {
      phase: 'traverse',
      visitedNodeIds: [...visited],
    },
  )
  addStep(
    'singly-traverse-complete',
    `Traversal complete. Visited ${visited.length} node${visited.length === 1 ? '' : 's'}.`,
    {
      phase: 'complete',
      visitedNodeIds: [...visited],
    },
    [],
  )

  return steps
}
