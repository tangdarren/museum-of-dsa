export type LinkedListVariant = 'singly' | 'doubly'

export type LinkedListNode = {
  id: string
  label: string
  value: number
  nextId?: string
  previousId?: string
}

export type LinkedListData = {
  variant: LinkedListVariant
  headId: string | null
  tailId?: string | null
  nodes: LinkedListNode[]
}

export type LinkedListNodeState =
  | 'default'
  | 'active'
  | 'visited'
  | 'found'
  | 'target'
  | 'inserting'
  | 'deleting'

export type LinkedListNodeStates = Partial<Record<string, LinkedListNodeState>>

export type LinkedListPointer = 'head' | 'tail' | 'current' | 'previous' | 'next'

export type LinkedListPointerChange = {
  pointer: LinkedListPointer
  fromNodeId?: string | null
  toNodeId?: string | null
}

export type LinkedListOperationPhase =
  | 'start'
  | 'traverse'
  | 'compare'
  | 'relink'
  | 'complete'

export type LinkedListOperationId =
  | 'singly-linked-list-search'
  | 'singly-linked-list-insert'
  | 'singly-linked-list-delete'

export type LinkedListMetrics = {
  comparisons: number
  visits: number
  pointerUpdates: number
}

export type LinkedListAlgorithmState = {
  variant: LinkedListVariant
  headId: string | null
  tailId?: string | null
  nodes: LinkedListNode[]
  currentNodeId?: string
  visitedNodeIds: string[]
  metrics: LinkedListMetrics
}
