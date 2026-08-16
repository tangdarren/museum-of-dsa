import type {
  AlgorithmCatalogEntry,
  AlgorithmCategory,
  AlgorithmDefinition,
  AlgorithmId,
} from '../types/algorithm'

export const ALGORITHMS: AlgorithmDefinition[] = [
  {
    id: 'bfs',
    title: 'Breadth First Search',
    category: 'Graph Traversal',
    shortDescription: 'Explores a graph level by level.',
    explore: ['Traversal order', 'Visited nodes', 'Frontier'],
    available: true,
  },
  {
    id: 'dfs',
    title: 'Depth First Search',
    category: 'Graph Traversal',
    shortDescription: 'Follows one path as far as it can go.',
    explore: ['Depth-first exploration', 'Visited nodes', 'Traversal stack'],
    available: true,
  },
  {
    id: 'dijkstra',
    title: "Dijkstra's Algorithm",
    category: 'Pathfinding',
    shortDescription: 'Finds the shortest path in a weighted graph.',
    explore: ['Weighted edges', 'Tentative distances', 'Shortest path'],
    available: true,
  },
  {
    id: 'astar',
    title: 'A* Search',
    category: 'Pathfinding',
    shortDescription: 'Finds a path with the help of a heuristic.',
    explore: ['Path cost', 'Heuristic estimate', 'Shortest path'],
    available: true,
  },
]

export const FUTURE_ALGORITHMS: AlgorithmCatalogEntry[] = [
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    category: 'Sorting',
    shortDescription: 'Sorts values by partitioning around a pivot.',
    available: false,
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    category: 'Sorting',
    shortDescription: 'Sorts values by dividing and merging them.',
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
    entries: FUTURE_ALGORITHMS,
  },
]

export function getAlgorithmById(id: AlgorithmId): AlgorithmDefinition {
  return ALGORITHMS.find((entry) => entry.id === id) ?? ALGORITHMS[0]
}
