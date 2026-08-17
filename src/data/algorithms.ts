import type {
  AlgorithmCatalogEntry,
  AlgorithmCategory,
  AlgorithmDefinition,
  AlgorithmId,
  FutureAlgorithmDefinition,
} from '../types/algorithm'

export const ALGORITHMS: AlgorithmDefinition[] = [
  {
    id: 'bfs',
    title: 'Breadth First Search',
    category: 'Graph Traversal',
    shortDescription: 'Explores a graph level by level.',
    explore: ['Traversal order', 'Visited nodes', 'Frontier'],
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    available: true,
  },
  {
    id: 'dfs',
    title: 'Depth First Search',
    category: 'Graph Traversal',
    shortDescription: 'Follows one path as far as it can go.',
    explore: ['Depth-first exploration', 'Visited nodes', 'Traversal stack'],
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    available: true,
  },
  {
    id: 'dijkstra',
    title: "Dijkstra's Algorithm",
    category: 'Pathfinding',
    shortDescription: 'Finds the shortest path in a weighted graph.',
    explore: ['Weighted edges', 'Tentative distances', 'Shortest path'],
    complexity: { time: 'O(V²)', space: 'O(V)' },
    available: true,
  },
  {
    id: 'astar',
    title: 'A* Search',
    category: 'Pathfinding',
    shortDescription: 'Finds a path with the help of a heuristic.',
    explore: ['Path cost', 'Heuristic estimate', 'Shortest path'],
    complexity: { time: 'O(V²)', space: 'O(V)' },
    available: true,
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'Sorting',
    shortDescription: 'Repeatedly swaps adjacent values that are out of order.',
    explore: ['Adjacent comparisons', 'Swaps', 'Sorted suffix'],
    complexity: { time: 'O(n²)', space: 'O(1)' },
    available: true,
  },
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    category: 'Sorting',
    shortDescription: 'Builds a sorted prefix by inserting each value into place.',
    explore: ['Sorted prefix', 'Shifting values', 'Inserting the current key'],
    complexity: { time: 'O(n²)', space: 'O(1)' },
    available: true,
  },
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    category: 'Sorting',
    shortDescription: 'Sorts values by partitioning around a pivot.',
    explore: ['Pivot selection', 'Partitioning', 'Finalized positions'],
    complexity: { time: 'O(n log n)', space: 'O(log n)' },
    available: true,
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    category: 'Sorting',
    shortDescription: 'Sorts values by dividing and merging them.',
    explore: ['Dividing ranges', 'Merging halves', 'Writing values back'],
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    available: true,
  },
]

export const FUTURE_TREE_ALGORITHMS: FutureAlgorithmDefinition[] = [
  {
    id: 'bst-search',
    title: 'BST Search',
    category: 'Trees',
    shortDescription: 'Finds a value by comparing it with each node and going left or right.',
    available: false,
  },
  {
    id: 'bst-insert',
    title: 'BST Insert',
    category: 'Trees',
    shortDescription: 'Places a value by following left and right child links.',
    available: false,
  },
  {
    id: 'inorder-traversal',
    title: 'Inorder Traversal',
    category: 'Trees',
    shortDescription: 'Visits nodes from left to right, producing sorted order in a BST.',
    available: false,
  },
]

export const ALGORITHM_SECTIONS: {
  category: AlgorithmCategory
  entries: AlgorithmCatalogEntry[]
}[] = [
  {
    category: 'Graph Traversal',
    entries: ALGORITHMS.filter((algorithm) => algorithm.category === 'Graph Traversal'),
  },
  {
    category: 'Pathfinding',
    entries: ALGORITHMS.filter((algorithm) => algorithm.category === 'Pathfinding'),
  },
  {
    category: 'Sorting',
    entries: ALGORITHMS.filter((algorithm) => algorithm.category === 'Sorting'),
  },
  {
    category: 'Trees',
    entries: FUTURE_TREE_ALGORITHMS,
  },
]

export function getAlgorithmById(id: AlgorithmId): AlgorithmDefinition {
  return ALGORITHMS.find((entry) => entry.id === id) ?? ALGORITHMS[0]
}
