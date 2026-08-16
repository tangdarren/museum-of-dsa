import type { Vec3 } from '../navigation/destinations'

export type GraphNode = {
  id: string
  label: string
  position: Vec3
}

export type GraphEdge = {
  id: string
  source: string
  target: string
  weight?: number
}

export type GraphData = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export type GraphNodeState =
  | 'default'
  | 'active'
  | 'frontier'
  | 'visited'
  | 'start'
  | 'target'

export type GraphEdgeState = 'default' | 'active' | 'visited' | 'path'

export type GraphNodeStates = Partial<Record<string, GraphNodeState>>
export type GraphEdgeStates = Partial<Record<string, GraphEdgeState>>
