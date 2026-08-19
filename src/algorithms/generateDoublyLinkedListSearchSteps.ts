import type {
  AlgorithmInspection,
  AlgorithmPathResult,
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

function neighborLabel(
  nodeId: string | undefined,
  nodesById: Map<string, LinkedListNode>,
) {
  if (!nodeId) {
    return 'NULL'
  }

  return nodesById.get(nodeId)?.label ?? nodeId
}

function compareInspection(
  targetValue: number,
  node: LinkedListNode,
  nodesById: Map<string, LinkedListNode>,
  matched: boolean,
): AlgorithmInspection {
  return {
    title: `Compare with ${node.label}`,
    lines: [
      `Target ${targetValue}`,
      `Current ${node.label}`,
      `next → ${neighborLabel(node.nextId, nodesById)}`,
      `previous → ${neighborLabel(node.previousId, nodesById)}`,
      matched
        ? `Equal. ${targetValue} is at this node.`
        : `${targetValue} is not ${node.label}. Follow next.`,
    ],
  }
}

function compareDescription(
  targetValue: number,
  node: LinkedListNode,
  matched: boolean,
): string {
  if (matched) {
    return `Compare ${targetValue} with ${node.label}. They match.`
  }

  return `Compare ${targetValue} with ${node.label}. They do not match.`
}

export function generateDoublyLinkedListSearchSteps(
  list: LinkedListData,
  targetValue: number,
): AlgorithmStep[] {
  const state = createLinkedListState(list)
  const nodesById = indexLinkedListNodes(state.nodes)
  const targetNodeId = state.nodes.find(
    (node) => node.value === targetValue,
  )?.id
  const steps: AlgorithmStep[] = []
  const path: string[] = []

  const pathLabels = () => getLinkedListNodeLabels(path, nodesById)

  const addStep = (
    id: string,
    description: string,
    highlights: LinkedListSnapshotHighlights,
    extras: {
      auxiliaryValues?: string[]
      inspection?: AlgorithmInspection
      pathResult?: AlgorithmPathResult
    } = {},
  ) => {
    steps.push(
      createLinkedListStep({
        id,
        description,
        snapshot: createLinkedListSnapshot(state, {
          targetNodeId,
          ...highlights,
        }),
        auxiliaryData: {
          label: 'Search path',
          values: extras.auxiliaryValues ?? pathLabels(),
          emphasis: 'last',
        },
        inspection: extras.inspection,
        pathResult: extras.pathResult,
      }),
    )
  }

  const completeSearch = (found: boolean, description: string) => {
    addStep(
      found ? 'doubly-search-found' : 'doubly-search-not-found',
      description,
      {
        phase: 'complete',
        currentNodeId: found ? path[path.length - 1] : undefined,
        visitedNodeIds: [...path],
        foundNodeId: found ? path[path.length - 1] : undefined,
        searchResult: found ? 'found' : 'not-found',
      },
      {
        auxiliaryValues: [],
        pathResult: {
          found,
          nodes: pathLabels(),
          cost: null,
          exploredCount: path.length,
        },
      },
    )
  }

  if (!state.headId) {
    addStep(
      'doubly-search-start',
      `HEAD is NULL, so ${targetValue} is not in the list.`,
      {
        phase: 'start',
        visitedNodeIds: [],
        searchResult: 'not-found',
      },
      { auxiliaryValues: [] },
    )
    completeSearch(false, `${targetValue} was not found.`)
    return steps
  }

  const head = nodesById.get(state.headId)

  if (!head) {
    addStep(
      'doubly-search-start',
      `HEAD is NULL, so ${targetValue} is not in the list.`,
      {
        phase: 'start',
        visitedNodeIds: [],
        searchResult: 'not-found',
      },
      { auxiliaryValues: [] },
    )
    completeSearch(false, `${targetValue} was not found.`)
    return steps
  }

  path.push(head.id)
  state.visitedNodeIds = []
  state.metrics.visits += 1
  state.currentNodeId = head.id

  addStep(
    'doubly-search-start',
    `Start at HEAD (${head.label}) and search forward for ${targetValue}.`,
    {
      phase: 'start',
      currentNodeId: head.id,
      visitedNodeIds: [],
    },
  )

  let current: LinkedListNode | undefined = head
  const seen = new Set<string>()

  while (current && !seen.has(current.id)) {
    seen.add(current.id)
    const node = current
    state.metrics.comparisons += 1
    state.currentNodeId = node.id

    if (node.value === targetValue) {
      addStep(
        `doubly-search-compare-${node.id}`,
        compareDescription(targetValue, node, true),
        {
          phase: 'compare',
          currentNodeId: node.id,
          visitedNodeIds: path.filter((id) => id !== node.id),
          comparedNodeIds: [node.id],
          foundNodeId: node.id,
          searchResult: 'found',
        },
        { inspection: compareInspection(targetValue, node, nodesById, true) },
      )
      completeSearch(true, `Found ${targetValue}.`)
      return steps
    }

    addStep(
      `doubly-search-compare-${node.id}`,
      compareDescription(targetValue, node, false),
      {
        phase: 'compare',
        currentNodeId: node.id,
        visitedNodeIds: path.filter((id) => id !== node.id),
        comparedNodeIds: [node.id],
      },
      { inspection: compareInspection(targetValue, node, nodesById, false) },
    )

    if (!node.nextId) {
      completeSearch(
        false,
        `Next is NULL. ${targetValue} is not in the list.`,
      )
      return steps
    }

    const next = nodesById.get(node.nextId)

    if (!next) {
      completeSearch(
        false,
        `Next is NULL. ${targetValue} is not in the list.`,
      )
      return steps
    }

    addStep(
      `doubly-search-follow-${node.id}`,
      `Follow next from ${node.label} to ${next.label}. ${next.label}.previous points back to ${node.label}.`,
      {
        phase: 'traverse',
        currentNodeId: next.id,
        visitedNodeIds: [...path],
        highlightedNodeIds: [node.id, next.id],
        pointerChanges: [
          {
            pointer: 'current',
            fromNodeId: node.id,
            toNodeId: next.id,
          },
        ],
      },
    )

    path.push(next.id)
    state.visitedNodeIds = path.filter((id) => id !== next.id)
    state.metrics.visits += 1
    state.currentNodeId = next.id
    current = next
  }

  completeSearch(false, `${targetValue} is not in the list.`)
  return steps
}
