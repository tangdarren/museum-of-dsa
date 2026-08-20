import type { AlgorithmCategory, AlgorithmId } from '../types/algorithm'
import type { AlgorithmStep } from '../types/algorithmStep'
import type { GraphData } from '../types/graph'
import type { HashTableData } from '../types/hashTable'
import type {
  LinkedListData,
  LinkedListMutationPosition,
  LinkedListVariant,
} from '../types/linkedList'
import type { TreeData } from '../types/tree'
import { generateAStarSteps } from './generateAStarSteps'
import { generateBfsSteps } from './generateBfsSteps'
import { generateBstSearchSteps } from './generateBstSearchSteps'
import { generateBubbleSortSteps } from './generateBubbleSortSteps'
import { generateDfsSteps } from './generateDfsSteps'
import { generateDijkstraSteps } from './generateDijkstraSteps'
import { generateDoublyLinkedListDeleteSteps } from './generateDoublyLinkedListDeleteSteps'
import { generateDoublyLinkedListInsertSteps } from './generateDoublyLinkedListInsertSteps'
import { generateDoublyLinkedListSearchSteps } from './generateDoublyLinkedListSearchSteps'
import {
  generateDoublyLinkedListBackwardTraverseSteps,
  generateDoublyLinkedListForwardTraverseSteps,
} from './generateDoublyLinkedListTraverseSteps'
import { generateHashTableDeleteSteps } from './generateHashTableDeleteSteps'
import { generateHashTableInsertSteps } from './generateHashTableInsertSteps'
import { generateHashTableSearchSteps } from './generateHashTableSearchSteps'
import { generateInsertionSortSteps } from './generateInsertionSortSteps'
import { generateMergeSortSteps } from './generateMergeSortSteps'
import { generateQuickSortSteps } from './generateQuickSortSteps'
import { generateSinglyLinkedListDeleteSteps } from './generateSinglyLinkedListDeleteSteps'
import { generateSinglyLinkedListInsertSteps } from './generateSinglyLinkedListInsertSteps'
import { generateSinglyLinkedListSearchSteps } from './generateSinglyLinkedListSearchSteps'
import { generateSinglyLinkedListTraverseSteps } from './generateSinglyLinkedListTraverseSteps'
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

export const SINGLY_LINKED_LIST_ALGORITHM_IDS: ReadonlySet<AlgorithmId> =
  new Set([
    'singly-linked-list-traverse',
    'singly-linked-list-search',
    'singly-linked-list-insert',
    'singly-linked-list-delete',
  ])

export const DOUBLY_LINKED_LIST_ALGORITHM_IDS: ReadonlySet<AlgorithmId> =
  new Set([
    'doubly-linked-list-traverse-forward',
    'doubly-linked-list-traverse-backward',
    'doubly-linked-list-search',
    'doubly-linked-list-insert',
    'doubly-linked-list-delete',
  ])

export const LINKED_LIST_ALGORITHM_IDS: ReadonlySet<AlgorithmId> = new Set([
  ...SINGLY_LINKED_LIST_ALGORITHM_IDS,
  ...DOUBLY_LINKED_LIST_ALGORITHM_IDS,
])

export const HASH_TABLE_ALGORITHM_IDS: ReadonlySet<AlgorithmId> = new Set([
  'hash-table-insert',
  'hash-table-search',
  'hash-table-delete',
])

export type AlgorithmRunInput = {
  graph: GraphData
  startNodeId: string | null
  targetNodeId?: string | null
  values: readonly number[]
  tree: TreeData
  targetValue?: number | null
  list: LinkedListData
  insertValue?: number | null
  insertPosition?: LinkedListMutationPosition
  deletePosition?: LinkedListMutationPosition
  table: HashTableData
  hashKey?: string | null
  hashValue?: string | null
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

export function isLinkedListAlgorithm(algorithmId: AlgorithmId): boolean {
  return LINKED_LIST_ALGORITHM_IDS.has(algorithmId)
}

export function isHashTableAlgorithm(algorithmId: AlgorithmId): boolean {
  return HASH_TABLE_ALGORITHM_IDS.has(algorithmId)
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

export function usesLinkedListSearch(algorithmId: AlgorithmId): boolean {
  return (
    algorithmId === 'singly-linked-list-search' ||
    algorithmId === 'doubly-linked-list-search'
  )
}

export function usesLinkedListInsert(algorithmId: AlgorithmId): boolean {
  return (
    algorithmId === 'singly-linked-list-insert' ||
    algorithmId === 'doubly-linked-list-insert'
  )
}

export function usesLinkedListDelete(algorithmId: AlgorithmId): boolean {
  return (
    algorithmId === 'singly-linked-list-delete' ||
    algorithmId === 'doubly-linked-list-delete'
  )
}

export function usesHashTableSearch(algorithmId: AlgorithmId): boolean {
  return algorithmId === 'hash-table-search'
}

export function usesHashTableInsert(algorithmId: AlgorithmId): boolean {
  return algorithmId === 'hash-table-insert'
}

export function usesHashTableDelete(algorithmId: AlgorithmId): boolean {
  return algorithmId === 'hash-table-delete'
}

export function getLinkedListVariantForAlgorithm(
  algorithmId: AlgorithmId,
): LinkedListVariant | null {
  if (SINGLY_LINKED_LIST_ALGORITHM_IDS.has(algorithmId)) {
    return 'singly'
  }

  if (DOUBLY_LINKED_LIST_ALGORITHM_IDS.has(algorithmId)) {
    return 'doubly'
  }

  return null
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

function getLinkedListAlgorithmSteps(
  algorithmId: AlgorithmId,
  list: LinkedListData,
  targetValue: number | null,
  insertValue: number | null,
  insertPosition: LinkedListMutationPosition,
  deletePosition: LinkedListMutationPosition,
): AlgorithmStep[] {
  if (algorithmId === 'singly-linked-list-traverse') {
    return generateSinglyLinkedListTraverseSteps(list)
  }

  if (algorithmId === 'singly-linked-list-search') {
    return targetValue === null
      ? []
      : generateSinglyLinkedListSearchSteps(list, targetValue)
  }

  if (algorithmId === 'singly-linked-list-insert') {
    return insertValue === null
      ? []
      : generateSinglyLinkedListInsertSteps(list, insertValue, insertPosition)
  }

  if (algorithmId === 'singly-linked-list-delete') {
    return generateSinglyLinkedListDeleteSteps(list, deletePosition)
  }

  if (algorithmId === 'doubly-linked-list-traverse-forward') {
    return generateDoublyLinkedListForwardTraverseSteps(list)
  }

  if (algorithmId === 'doubly-linked-list-traverse-backward') {
    return generateDoublyLinkedListBackwardTraverseSteps(list)
  }

  if (algorithmId === 'doubly-linked-list-search') {
    return targetValue === null
      ? []
      : generateDoublyLinkedListSearchSteps(list, targetValue)
  }

  if (algorithmId === 'doubly-linked-list-insert') {
    return insertValue === null
      ? []
      : generateDoublyLinkedListInsertSteps(list, insertValue, insertPosition)
  }

  if (algorithmId === 'doubly-linked-list-delete') {
    return generateDoublyLinkedListDeleteSteps(list, deletePosition)
  }

  return []
}

function getHashTableAlgorithmSteps(
  algorithmId: AlgorithmId,
  table: HashTableData,
  hashKey: string | null,
  hashValue: string | null,
): AlgorithmStep[] {
  if (!hashKey) {
    return []
  }

  if (algorithmId === 'hash-table-search') {
    return generateHashTableSearchSteps(table, hashKey)
  }

  if (algorithmId === 'hash-table-delete') {
    return generateHashTableDeleteSteps(table, hashKey)
  }

  if (algorithmId === 'hash-table-insert') {
    return hashValue === null
      ? []
      : generateHashTableInsertSteps(table, hashKey, hashValue)
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

  if (isLinkedListAlgorithm(algorithmId)) {
    return getLinkedListAlgorithmSteps(
      algorithmId,
      input.list,
      input.targetValue ?? null,
      input.insertValue ?? null,
      input.insertPosition ?? { at: 'head' },
      input.deletePosition ?? { at: 'tail' },
    )
  }

  if (isHashTableAlgorithm(algorithmId)) {
    return getHashTableAlgorithmSteps(
      algorithmId,
      input.table,
      input.hashKey ?? null,
      input.hashValue ?? null,
    )
  }

  return getGraphAlgorithmSteps(
    algorithmId,
    input.graph,
    input.startNodeId,
    input.targetNodeId ?? null,
  )
}

export { isHashTableCategory, isLinkedListCategory } from '../types/algorithm'
