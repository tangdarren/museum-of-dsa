export type AlgorithmId =
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'astar'
  | 'bubble-sort'
  | 'insertion-sort'
  | 'quick-sort'
  | 'merge-sort'

export type AlgorithmCategory = 'Graph Traversal' | 'Pathfinding' | 'Sorting'

export type AlgorithmComplexity = {
  time: string
  space: string
}

export type AlgorithmDefinition = {
  id: AlgorithmId
  title: string
  category: AlgorithmCategory
  shortDescription: string
  explore: [string, string, string]
  complexity: AlgorithmComplexity
  available: true
}

export type AlgorithmCatalogEntry = AlgorithmDefinition
