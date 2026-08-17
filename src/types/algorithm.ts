export type AlgorithmId =
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'astar'
  | 'bubble-sort'
  | 'insertion-sort'
  | 'quick-sort'
  | 'merge-sort'
  | 'preorder-traversal'
  | 'inorder-traversal'
  | 'postorder-traversal'
  | 'bst-search'

export type FutureAlgorithmId = 'bst-insert'

export type AlgorithmCategory = 'Graph Traversal' | 'Pathfinding' | 'Sorting' | 'Trees'

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
