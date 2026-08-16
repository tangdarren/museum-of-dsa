export type AlgorithmId = 'bfs' | 'dfs' | 'dijkstra' | 'astar'

export type FutureAlgorithmId = 'quick-sort' | 'merge-sort'

export type AlgorithmCategory = 'Graph Traversal' | 'Pathfinding' | 'Sorting'

export type AlgorithmDefinition = {
  id: AlgorithmId
  title: string
  category: Exclude<AlgorithmCategory, 'Sorting'>
  shortDescription: string
  explore: [string, string, string]
  available: true
}

export type FutureAlgorithmDefinition = {
  id: FutureAlgorithmId
  title: string
  category: 'Sorting'
  shortDescription: string
  available: false
}

export type AlgorithmCatalogEntry =
  | AlgorithmDefinition
  | FutureAlgorithmDefinition
