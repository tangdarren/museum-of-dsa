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
  | 'singly-linked-list-traverse'
  | 'singly-linked-list-search'
  | 'singly-linked-list-insert'
  | 'singly-linked-list-delete'
  | 'doubly-linked-list-traverse-forward'
  | 'doubly-linked-list-traverse-backward'
  | 'doubly-linked-list-search'
  | 'doubly-linked-list-insert'
  | 'doubly-linked-list-delete'
  | 'hash-table-insert'
  | 'hash-table-search'
  | 'hash-table-delete'

export type FutureAlgorithmId = 'bst-insert'

export type AlgorithmRoomCategory =
  | 'Graph Traversal'
  | 'Pathfinding'
  | 'Sorting'
  | 'Trees'

export type LinkedListCategory = 'Singly Linked List' | 'Doubly Linked List'

export type HashTableCategory = 'Hash Table'

export type DataStructureCategory = LinkedListCategory | HashTableCategory

export type AlgorithmCategory = AlgorithmRoomCategory | DataStructureCategory

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

export type AlgorithmCatalogSection = {
  category: AlgorithmCategory
  entries: AlgorithmCatalogEntry[]
}

export function isAlgorithmRoomCategory(
  category: AlgorithmCategory,
): category is AlgorithmRoomCategory {
  return (
    category === 'Graph Traversal' ||
    category === 'Pathfinding' ||
    category === 'Sorting' ||
    category === 'Trees'
  )
}

export function isLinkedListCategory(
  category: AlgorithmCategory,
): category is LinkedListCategory {
  return (
    category === 'Singly Linked List' || category === 'Doubly Linked List'
  )
}

export function isHashTableCategory(
  category: AlgorithmCategory,
): category is HashTableCategory {
  return category === 'Hash Table'
}

export function isDataStructureCategory(
  category: AlgorithmCategory,
): category is DataStructureCategory {
  return isLinkedListCategory(category) || isHashTableCategory(category)
}
