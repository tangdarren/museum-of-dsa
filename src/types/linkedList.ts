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
  | 'highlighted'
  | 'inserting'
  | 'deleting'

export type LinkedListNodeStates = Partial<Record<string, LinkedListNodeState>>

export type LinkedListLinkKind = 'next' | 'previous'

export type LinkedListLinkState = 'default' | 'active' | 'changing'

export type LinkedListLinkStates = Partial<Record<string, LinkedListLinkState>>

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

export type LinkedListTraversalDirection = 'forward' | 'backward'

export type LinkedListOperationId =
  | 'singly-linked-list-traverse'
  | 'singly-linked-list-search'
  | 'singly-linked-list-insert'
  | 'singly-linked-list-delete'
  | 'doubly-linked-list-traverse-forward'
  | 'doubly-linked-list-traverse-backward'
  | 'doubly-linked-list-search'
  | 'doubly-linked-list-insert'
  | 'doubly-linked-list-delete'

export type LinkedListMutationPosition =
  | { at: 'head' }
  | { at: 'tail' }
  | { at: 'index'; index: number }

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
