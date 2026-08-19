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

function compareInspection(
  targetValue: number,
  node: LinkedListNode,
  matched: boolean,
): AlgorithmInspection {
  return {
    title: `Compare with ${node.label}`,
    lines: [
      `Target ${targetValue}`,
      `Current ${node.label}`,
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

export function generateSinglyLinkedListSearchSteps(
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
      found ? 'singly-search-found' : 'singly-search-not-found',
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
      'singly-search-start',
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
      'singly-search-start',
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
    'singly-search-start',
    `Start at HEAD (${head.label}) and search for ${targetValue}.`,
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
        `singly-search-compare-${node.id}`,
        compareDescription(targetValue, node, true),
        {
          phase: 'compare',
          currentNodeId: node.id,
          visitedNodeIds: path.filter((id) => id !== node.id),
          comparedNodeIds: [node.id],
          foundNodeId: node.id,
          searchResult: 'found',
        },
        { inspection: compareInspection(targetValue, node, true) },
      )
      completeSearch(true, `Found ${targetValue}.`)
      return steps
    }

    addStep(
      `singly-search-compare-${node.id}`,
      compareDescription(targetValue, node, false),
      {
        phase: 'compare',
        currentNodeId: node.id,
        visitedNodeIds: path.filter((id) => id !== node.id),
        comparedNodeIds: [node.id],
      },
      { inspection: compareInspection(targetValue, node, false) },
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
      `singly-search-follow-${node.id}`,
      `Follow next from ${node.label} to ${next.label}.`,
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
