import type {
  AlgorithmInspection,
  AlgorithmMetricTable,
  AlgorithmPathResult,
  AlgorithmStep,
} from '../types/algorithmStep'
import type { TreeData, TreeNode } from '../types/tree'
import { createTreeStep } from './createTreeStep'
import {
  createTreeSnapshot,
  createTreeState,
  findTreeEdgeId,
  indexTreeNodes,
  type TreeSnapshotHighlights,
} from './treeShared'

function createSearchMetricsTable(
  comparisons: number,
  visits: number,
): AlgorithmMetricTable {
  return {
    label: 'Metrics',
    columns: ['Metric', 'Count'],
    rows: [
      {
        id: 'comparisons',
        cells: ['Comparisons', String(comparisons)],
      },
      {
        id: 'visits',
        cells: ['Visits', String(visits)],
      },
    ],
  }
}

function compareInspection(
  targetValue: number,
  node: TreeNode,
  direction: 'left' | 'right' | 'equal',
): AlgorithmInspection {
  const comparison =
    direction === 'equal'
      ? `Equal. ${targetValue} is at this node.`
      : direction === 'left'
        ? `${targetValue} < ${node.label}. Search the left subtree.`
        : `${targetValue} > ${node.label}. Search the right subtree.`

  return {
    title: `Compare with ${node.label}`,
    lines: [`Target ${targetValue}`, `Current ${node.label}`, comparison],
  }
}

function compareDescription(
  targetValue: number,
  node: TreeNode,
  direction: 'left' | 'right' | 'equal',
): string {
  if (direction === 'equal') {
    return `Compare ${targetValue} with ${node.label}. They match.`
  }

  if (direction === 'left') {
    return `Compare ${targetValue} with ${node.label}. ${targetValue} is smaller, so go left.`
  }

  return `Compare ${targetValue} with ${node.label}. ${targetValue} is larger, so go right.`
}

export function generateBstSearchSteps(
  tree: TreeData,
  targetValue: number,
): AlgorithmStep[] {
  const state = createTreeState(tree)
  const nodesById = indexTreeNodes(state.nodes)
  const targetNodeId = state.nodes.find(
    (node) => node.value === targetValue,
  )?.id
  const steps: AlgorithmStep[] = []
  const path: string[] = []
  const visitedEdges: string[] = []
  const pathEdges: string[] = []

  const pathLabels = () =>
    path.map((id) => nodesById.get(id)?.label ?? id)

  const addStep = (
    id: string,
    description: string,
    highlights: TreeSnapshotHighlights,
    extras: {
      auxiliaryValues?: string[]
      inspection?: AlgorithmInspection
      pathResult?: AlgorithmPathResult
    } = {},
  ) => {
    steps.push(
      createTreeStep({
        id,
        description,
        snapshot: createTreeSnapshot(state, {
          targetNodeId,
          targetValue,
          visitedEdgeIds: [...visitedEdges],
          pathEdgeIds: [...pathEdges],
          ...highlights,
        }),
        metrics: createSearchMetricsTable(
          state.metrics.comparisons,
          state.metrics.visits,
        ),
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

  const completeSearch = (
    found: boolean,
    description: string,
    direction?: 'left' | 'right' | 'equal',
  ) => {
    addStep(
      found ? 'bst-search-found' : 'bst-search-not-found',
      description,
      {
        visitedNodeIds: [...path],
        pathNodeIds: [...path],
        comparedNodeIds: [],
        foundNodeId: found ? path[path.length - 1] : undefined,
        comparisonDirection: direction,
        searchResult: found ? 'found' : 'not-found',
        activeEdgeIds: [],
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

  if (!state.rootId) {
    addStep(
      'bst-search-start',
      `The tree is empty, so ${targetValue} is not in the tree.`,
      {
        visitedNodeIds: [],
        pathNodeIds: [],
        comparedNodeIds: [],
        searchResult: 'not-found',
        activeEdgeIds: [],
      },
      { auxiliaryValues: [] },
    )
    completeSearch(false, `${targetValue} was not found.`)
    return steps
  }

  const root = nodesById.get(state.rootId)

  if (!root) {
    addStep(
      'bst-search-start',
      `The tree is empty, so ${targetValue} is not in the tree.`,
      {
        visitedNodeIds: [],
        pathNodeIds: [],
        comparedNodeIds: [],
        searchResult: 'not-found',
        activeEdgeIds: [],
      },
      { auxiliaryValues: [] },
    )
    completeSearch(false, `${targetValue} was not found.`)
    return steps
  }

  path.push(root.id)
  state.pathNodeIds = [...path]
  state.metrics.visits += 1

  addStep(
    'bst-search-start',
    `Start at ${root.label} and search for ${targetValue}.`,
    {
      currentNodeId: root.id,
      visitedNodeIds: [],
      pathNodeIds: [...path],
      comparedNodeIds: [],
      activeEdgeIds: [],
    },
  )

  let current: TreeNode | undefined = root

  while (current) {
    const node = current
    state.metrics.comparisons += 1

    if (targetValue === node.value) {
      addStep(
        `bst-search-compare-${node.id}`,
        compareDescription(targetValue, node, 'equal'),
        {
          currentNodeId: node.id,
          visitedNodeIds: path.filter((id) => id !== node.id),
          pathNodeIds: [...path],
          comparedNodeIds: [node.id],
          foundNodeId: node.id,
          comparisonDirection: 'equal',
          searchResult: 'found',
          activeEdgeIds: [],
        },
        { inspection: compareInspection(targetValue, node, 'equal') },
      )
      completeSearch(true, `Found ${targetValue}.`, 'equal')
      return steps
    }

    const direction: 'left' | 'right' =
      targetValue < node.value ? 'left' : 'right'
    const childId = direction === 'left' ? node.leftId : node.rightId

    addStep(
      `bst-search-compare-${node.id}`,
      compareDescription(targetValue, node, direction),
      {
        currentNodeId: node.id,
        visitedNodeIds: path.filter((id) => id !== node.id),
        pathNodeIds: [...path],
        comparedNodeIds: [node.id],
        comparisonDirection: direction,
        activeEdgeIds: [],
      },
      { inspection: compareInspection(targetValue, node, direction) },
    )

    if (!childId) {
      completeSearch(
        false,
        `${targetValue} is not in the tree. It would be ${direction} of ${node.label}, but that child is missing.`,
        direction,
      )
      return steps
    }

    const child = nodesById.get(childId)

    if (!child) {
      completeSearch(
        false,
        `${targetValue} is not in the tree. It would be ${direction} of ${node.label}, but that child is missing.`,
        direction,
      )
      return steps
    }

    const edgeId = findTreeEdgeId(state, node.id, child.id)

    addStep(
      `bst-search-${direction}-${node.id}`,
      `Move ${direction} from ${node.label} to ${child.label}.`,
      {
        currentNodeId: child.id,
        visitedNodeIds: [...path],
        pathNodeIds: [...path, child.id],
        comparedNodeIds: [node.id, child.id],
        comparisonDirection: direction,
        activeEdgeIds: edgeId ? [edgeId] : [],
      },
    )

    if (edgeId) {
      visitedEdges.push(edgeId)
      pathEdges.push(edgeId)
    }

    path.push(child.id)
    state.pathNodeIds = [...path]
    state.visitedNodeIds = path.filter((id) => id !== child.id)
    state.metrics.visits += 1
    current = child
  }

  completeSearch(false, `${targetValue} is not in the tree.`)
  return steps
}
