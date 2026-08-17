import type { Vec3 } from '../navigation/destinations'

export type TreeNode = {
  id: string
  label: string
  value: number
  leftId?: string
  rightId?: string
  parentId?: string
  position: Vec3
}

export type TreeEdge = {
  id: string
  source: string
  target: string
  side: 'left' | 'right'
}

export type TreeData = {
  rootId: string | null
  nodes: TreeNode[]
  edges: TreeEdge[]
}

export type TreeNodeState =
  | 'default'
  | 'active'
  | 'visited'
  | 'found'
  | 'target'
  | 'frontier'

export type TreeEdgeState = 'default' | 'active' | 'visited' | 'path'

export type TreeNodeStates = Partial<Record<string, TreeNodeState>>
export type TreeEdgeStates = Partial<Record<string, TreeEdgeState>>

export type TreeMetrics = {
  comparisons: number
  visits: number
}

export type TreeAlgorithmState = {
  rootId: string | null
  nodes: TreeNode[]
  edges: TreeEdge[]
  currentNodeId?: string
  visitedNodeIds: string[]
  pathNodeIds: string[]
  metrics: TreeMetrics
}
