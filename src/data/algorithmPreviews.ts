import { copyTreeEdges, copyTreeNodes } from '../algorithms/treeShared'
import {
  createLinkedListSnapshot,
  createLinkedListState,
} from '../algorithms/linkedListShared'
import type { AlgorithmId } from '../types/algorithm'
import type {
  AlgorithmLinkedListSnapshot,
  AlgorithmSortingSnapshot,
  AlgorithmTreeSnapshot,
} from '../types/algorithmStep'
import type { GraphEdgeStates, GraphNodeStates } from '../types/graph'
import {
  SAMPLE_DOUBLY_LINKED_LIST,
  SAMPLE_LINKED_LIST,
} from './sampleLinkedList'
import { SAMPLE_SORTING_DATA } from './sampleSorting'
import { SAMPLE_TREE } from './sampleTree'

export type GraphAlgorithmPreview = {
  visualization: 'graph'
  nodeStates: GraphNodeStates
  edgeStates: GraphEdgeStates
  showWeights: boolean
}

export type SortingAlgorithmPreview = {
  visualization: 'sorting'
  snapshot: AlgorithmSortingSnapshot
}

export type TreeAlgorithmPreview = {
  visualization: 'tree'
  snapshot: AlgorithmTreeSnapshot
}

export type LinkedListAlgorithmPreview = {
  visualization: 'linked-list'
  snapshot: AlgorithmLinkedListSnapshot
}

export type AlgorithmPreview =
  | GraphAlgorithmPreview
  | SortingAlgorithmPreview
  | TreeAlgorithmPreview
  | LinkedListAlgorithmPreview

const SORTING_PREVIEW_VALUES = [...SAMPLE_SORTING_DATA.values]

export const ALGORITHM_PREVIEWS: Record<AlgorithmId, AlgorithmPreview> = {
  bfs: {
    visualization: 'graph',
    nodeStates: {
      A: 'start',
      B: 'frontier',
      C: 'frontier',
      E: 'visited',
    },
    edgeStates: {
      'A-B': 'active',
      'A-C': 'active',
      'B-E': 'visited',
    },
    showWeights: false,
  },
  dfs: {
    visualization: 'graph',
    nodeStates: {
      A: 'start',
      B: 'visited',
      D: 'active',
      E: 'visited',
    },
    edgeStates: {
      'A-B': 'path',
      'B-D': 'path',
      'B-E': 'visited',
    },
    showWeights: false,
  },
  dijkstra: {
    visualization: 'graph',
    nodeStates: {
      A: 'start',
      B: 'visited',
      C: 'visited',
      E: 'active',
    },
    edgeStates: {
      'A-B': 'visited',
      'A-C': 'visited',
      'B-E': 'active',
    },
    showWeights: true,
  },
  astar: {
    visualization: 'graph',
    nodeStates: {
      A: 'start',
      B: 'visited',
      E: 'frontier',
      G: 'target',
    },
    edgeStates: {
      'A-B': 'visited',
      'B-E': 'active',
      'E-G': 'path',
    },
    showWeights: true,
  },
  'bubble-sort': {
    visualization: 'sorting',
    snapshot: {
      values: SORTING_PREVIEW_VALUES,
      metrics: { comparisons: 3, swaps: 1, writes: 2 },
      comparedIndices: [2, 3],
      swappedIndices: [],
      activeRanges: [{ start: 0, end: 6 }],
      sortedIndices: [7],
    },
  },
  'insertion-sort': {
    visualization: 'sorting',
    snapshot: {
      values: [2, 6, 8, 4, 7, 1, 5, 3],
      metrics: { comparisons: 2, swaps: 0, writes: 1 },
      comparedIndices: [1, 3],
      writtenIndices: [3],
      activeRanges: [{ start: 0, end: 3 }],
      sortedIndices: [0, 1, 2],
    },
  },
  'quick-sort': {
    visualization: 'sorting',
    snapshot: {
      values: SORTING_PREVIEW_VALUES,
      metrics: { comparisons: 4, swaps: 2, writes: 4 },
      comparedIndices: [0, 7],
      pivotIndex: 7,
      activeRanges: [{ start: 0, end: 7 }],
      sortedIndices: [],
    },
  },
  'merge-sort': {
    visualization: 'sorting',
    snapshot: {
      values: SORTING_PREVIEW_VALUES,
      metrics: { comparisons: 2, swaps: 0, writes: 2 },
      comparedIndices: [3, 4],
      writtenIndices: [0],
      activeRanges: [
        { start: 0, end: 3 },
        { start: 4, end: 7 },
      ],
      sortedIndices: [0, 1, 2, 3],
    },
  },
  'preorder-traversal': {
    visualization: 'tree',
    snapshot: {
      rootNodeId: SAMPLE_TREE.rootId,
      nodes: copyTreeNodes(SAMPLE_TREE.nodes),
      edges: copyTreeEdges(SAMPLE_TREE.edges),
      metrics: { comparisons: 4, visits: 2 },
      currentNodeId: '4',
      visitedNodeIds: ['8'],
      pathNodeIds: ['8', '4'],
      activeEdgeIds: ['8-4'],
      visitedEdgeIds: ['8-4'],
      traversalOrder: ['8', '4'],
    },
  },
  'inorder-traversal': {
    visualization: 'tree',
    snapshot: {
      rootNodeId: SAMPLE_TREE.rootId,
      nodes: copyTreeNodes(SAMPLE_TREE.nodes),
      edges: copyTreeEdges(SAMPLE_TREE.edges),
      metrics: { comparisons: 4, visits: 2 },
      currentNodeId: '4',
      visitedNodeIds: ['2'],
      pathNodeIds: ['8', '4'],
      activeEdgeIds: [],
      visitedEdgeIds: ['8-4', '4-2'],
      traversalOrder: ['2', '4'],
    },
  },
  'postorder-traversal': {
    visualization: 'tree',
    snapshot: {
      rootNodeId: SAMPLE_TREE.rootId,
      nodes: copyTreeNodes(SAMPLE_TREE.nodes),
      edges: copyTreeEdges(SAMPLE_TREE.edges),
      metrics: { comparisons: 6, visits: 3 },
      currentNodeId: '4',
      visitedNodeIds: ['2', '6'],
      pathNodeIds: ['8', '4'],
      activeEdgeIds: [],
      visitedEdgeIds: ['8-4', '4-2', '4-6'],
      traversalOrder: ['2', '6', '4'],
    },
  },
  'bst-search': {
    visualization: 'tree',
    snapshot: {
      rootNodeId: SAMPLE_TREE.rootId,
      nodes: copyTreeNodes(SAMPLE_TREE.nodes),
      edges: copyTreeEdges(SAMPLE_TREE.edges),
      metrics: { comparisons: 2, visits: 2 },
      currentNodeId: '4',
      targetNodeId: '6',
      targetValue: 6,
      visitedNodeIds: ['8'],
      pathNodeIds: ['8', '4'],
      comparedNodeIds: ['4'],
      activeEdgeIds: ['8-4'],
      visitedEdgeIds: ['8-4'],
      pathEdgeIds: ['8-4'],
      comparisonDirection: 'left',
    },
  },
  'singly-linked-list-traverse': {
    visualization: 'linked-list',
    snapshot: createLinkedListSnapshot(createLinkedListState(SAMPLE_LINKED_LIST), {
      phase: 'traverse',
      currentNodeId: '2',
      visitedNodeIds: ['4', '7'],
      highlightedNodeIds: ['9'],
    }),
  },
  'singly-linked-list-search': {
    visualization: 'linked-list',
    snapshot: createLinkedListSnapshot(createLinkedListState(SAMPLE_LINKED_LIST), {
      phase: 'compare',
      currentNodeId: '9',
      targetNodeId: '9',
      visitedNodeIds: ['4', '7', '2'],
      comparedNodeIds: ['9'],
      foundNodeId: '9',
      searchResult: 'found',
    }),
  },
  'singly-linked-list-insert': {
    visualization: 'linked-list',
    snapshot: createLinkedListSnapshot(createLinkedListState(SAMPLE_LINKED_LIST), {
      phase: 'relink',
      currentNodeId: '4',
      insertingNodeId: '4',
      highlightedNodeIds: ['7'],
      pointerChanges: [
        { pointer: 'next', fromNodeId: '4', toNodeId: '7' },
        { pointer: 'head', toNodeId: '4' },
      ],
    }),
  },
  'singly-linked-list-delete': {
    visualization: 'linked-list',
    snapshot: createLinkedListSnapshot(createLinkedListState(SAMPLE_LINKED_LIST), {
      phase: 'relink',
      currentNodeId: '9',
      deletingNodeId: '6',
      highlightedNodeIds: ['9'],
      pointerChanges: [{ pointer: 'next', fromNodeId: '9', toNodeId: null }],
    }),
  },
  'doubly-linked-list-traverse-forward': {
    visualization: 'linked-list',
    snapshot: createLinkedListSnapshot(
      createLinkedListState(SAMPLE_DOUBLY_LINKED_LIST),
      {
        phase: 'traverse',
        currentNodeId: '2',
        visitedNodeIds: ['4', '7'],
        highlightedNodeIds: ['9'],
      },
    ),
  },
  'doubly-linked-list-traverse-backward': {
    visualization: 'linked-list',
    snapshot: createLinkedListSnapshot(
      createLinkedListState(SAMPLE_DOUBLY_LINKED_LIST),
      {
        phase: 'traverse',
        currentNodeId: '9',
        visitedNodeIds: ['6'],
        highlightedNodeIds: ['2'],
      },
    ),
  },
  'doubly-linked-list-search': {
    visualization: 'linked-list',
    snapshot: createLinkedListSnapshot(
      createLinkedListState(SAMPLE_DOUBLY_LINKED_LIST),
      {
        phase: 'compare',
        currentNodeId: '9',
        targetNodeId: '9',
        visitedNodeIds: ['4', '7', '2'],
        comparedNodeIds: ['9'],
        foundNodeId: '9',
        searchResult: 'found',
      },
    ),
  },
  'doubly-linked-list-insert': {
    visualization: 'linked-list',
    snapshot: createLinkedListSnapshot(
      createLinkedListState(SAMPLE_DOUBLY_LINKED_LIST),
      {
        phase: 'relink',
        currentNodeId: '4',
        insertingNodeId: '4',
        highlightedNodeIds: ['7'],
        pointerChanges: [
          { pointer: 'next', fromNodeId: '4', toNodeId: '7' },
          { pointer: 'previous', fromNodeId: '7', toNodeId: '4' },
          { pointer: 'head', toNodeId: '4' },
        ],
      },
    ),
  },
  'doubly-linked-list-delete': {
    visualization: 'linked-list',
    snapshot: createLinkedListSnapshot(
      createLinkedListState(SAMPLE_DOUBLY_LINKED_LIST),
      {
        phase: 'relink',
        currentNodeId: '9',
        deletingNodeId: '6',
        highlightedNodeIds: ['9'],
        pointerChanges: [
          { pointer: 'next', fromNodeId: '9', toNodeId: null },
          { pointer: 'tail', fromNodeId: '6', toNodeId: '9' },
        ],
      },
    ),
  },
}
