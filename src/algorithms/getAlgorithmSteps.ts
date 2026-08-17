import type { AlgorithmCategory, AlgorithmId } from '../types/algorithm'
import type { AlgorithmStep } from '../types/algorithmStep'
import type { GraphData } from '../types/graph'
import type { TreeData } from '../types/tree'
import { generateAStarSteps } from './generateAStarSteps'
import { generateBfsSteps } from './generateBfsSteps'
import { generateBstSearchSteps } from './generateBstSearchSteps'
import { generateBubbleSortSteps } from './generateBubbleSortSteps'
import { generateDfsSteps } from './generateDfsSteps'
import { generateDijkstraSteps } from './generateDijkstraSteps'
import { generateInsertionSortSteps } from './generateInsertionSortSteps'
import { generateMergeSortSteps } from './generateMergeSortSteps'
import { generateQuickSortSteps } from './generateQuickSortSteps'
import {
  generateInorderTraversalSteps,
  generatePostorderTraversalSteps,
  generatePreorderTraversalSteps,
} from './generateTreeTraversalSteps'

export const GRAPH_ALGORITHM_IDS: ReadonlySet<AlgorithmId> = new Set([
  'bfs',
  'dfs',
  'dijkstra',
  'astar',
])

export const SORTING_ALGORITHM_IDS: ReadonlySet<AlgorithmId> = new Set([
  'bubble-sort',
  'insertion-sort',
  'quick-sort',
  'merge-sort',
])

export const TREE_ALGORITHM_IDS: ReadonlySet<AlgorithmId> = new Set([
  'preorder-traversal',
  'inorder-traversal',
  'postorder-traversal',
  'bst-search',
])

export type AlgorithmRunInput = {
  graph: GraphData
  startNodeId: string | null
  targetNodeId?: string | null
  values: readonly number[]
  tree: TreeData
  targetValue?: number | null
}

export function isSortingAlgorithm(
  algorithmId: AlgorithmId,
): algorithmId is 'bubble-sort' | 'insertion-sort' | 'quick-sort' | 'merge-sort' {
  return SORTING_ALGORITHM_IDS.has(algorithmId)
}

export function isGraphAlgorithm(
  algorithmId: AlgorithmId,
): algorithmId is 'bfs' | 'dfs' | 'dijkstra' | 'astar' {
  return GRAPH_ALGORITHM_IDS.has(algorithmId)
}

export function isTreeAlgorithm(
  algorithmId: AlgorithmId,
): algorithmId is
  | 'preorder-traversal'
  | 'inorder-traversal'
  | 'postorder-traversal'
  | 'bst-search' {
  return TREE_ALGORITHM_IDS.has(algorithmId)
}

export function isSortingCategory(category: AlgorithmCategory): boolean {
  return category === 'Sorting'
}

export function isTreesCategory(category: AlgorithmCategory): boolean {
  return category === 'Trees'
}

export function usesStartNodeSelection(algorithmId: AlgorithmId): boolean {
  return isGraphAlgorithm(algorithmId)
}

export function usesTargetNodeSelection(algorithmId: AlgorithmId): boolean {
  return algorithmId === 'dijkstra' || algorithmId === 'astar'
}

export function usesTreeTargetSelection(algorithmId: AlgorithmId): boolean {
  return algorithmId === 'bst-search'
}

function getGraphAlgorithmSteps(
  algorithmId: AlgorithmId,
  graph: GraphData,
  startNodeId: string | null,
  targetNodeId: string | null,
): AlgorithmStep[] {
  if (algorithmId === 'bfs') {
    return startNodeId ? generateBfsSteps(graph, startNodeId) : []
  }

  if (algorithmId === 'dfs') {
    return startNodeId ? generateDfsSteps(graph, startNodeId) : []
  }

  if (algorithmId === 'dijkstra') {
    return startNodeId && targetNodeId
      ? generateDijkstraSteps(graph, startNodeId, targetNodeId)
      : []
  }

  if (algorithmId === 'astar') {
    return startNodeId && targetNodeId
      ? generateAStarSteps(graph, startNodeId, targetNodeId)
      : []
  }

  return []
}

function getSortingAlgorithmSteps(
  algorithmId: AlgorithmId,
  values: readonly number[],
): AlgorithmStep[] {
  if (algorithmId === 'bubble-sort') {
    return generateBubbleSortSteps(values)
  }

  if (algorithmId === 'insertion-sort') {
    return generateInsertionSortSteps(values)
  }

  if (algorithmId === 'quick-sort') {
    return generateQuickSortSteps(values)
  }

  if (algorithmId === 'merge-sort') {
    return generateMergeSortSteps(values)
  }

  return []
}

function getTreeAlgorithmSteps(
  algorithmId: AlgorithmId,
  tree: TreeData,
  targetValue: number | null,
): AlgorithmStep[] {
  if (algorithmId === 'preorder-traversal') {
    return generatePreorderTraversalSteps(tree)
  }

  if (algorithmId === 'inorder-traversal') {
    return generateInorderTraversalSteps(tree)
  }

  if (algorithmId === 'postorder-traversal') {
    return generatePostorderTraversalSteps(tree)
  }

  if (algorithmId === 'bst-search') {
    return targetValue === null ? [] : generateBstSearchSteps(tree, targetValue)
  }

  return []
}

export function getAlgorithmSteps(
  algorithmId: AlgorithmId,
  input: AlgorithmRunInput,
): AlgorithmStep[] {
  if (isSortingAlgorithm(algorithmId)) {
    return getSortingAlgorithmSteps(algorithmId, input.values)
  }

  if (isTreeAlgorithm(algorithmId)) {
    return getTreeAlgorithmSteps(
      algorithmId,
      input.tree,
      input.targetValue ?? null,
    )
  }

  return getGraphAlgorithmSteps(
    algorithmId,
    input.graph,
    input.startNodeId,
    input.targetNodeId ?? null,
  )
}
