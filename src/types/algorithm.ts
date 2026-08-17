export type AlgorithmId =
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'astar'
  | 'bubble-sort'
  | 'insertion-sort'
  | 'quick-sort'
  | 'merge-sort'

export type FutureAlgorithmId = 'bst-search' | 'bst-insert' | 'inorder-traversal'

export type AlgorithmCategory = 'Graph Traversal' | 'Pathfinding' | 'Sorting' | 'Trees'

export type AlgorithmComplexity = {
  time: string
  space: string
}

export type AlgorithmDefinition = {
  id: AlgorithmId
  title: string
  category: Exclude<AlgorithmCategory, 'Trees'>
  shortDescription: string
  explore: [string, string, string]
  complexity: AlgorithmComplexity
  available: true
}

export type FutureAlgorithmDefinition = {
  id: FutureAlgorithmId
  title: string
  category: 'Trees'
  shortDescription: string
  available: false
}

export type AlgorithmCatalogEntry =
  | AlgorithmDefinition
  | FutureAlgorithmDefinition
