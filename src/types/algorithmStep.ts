import type { GraphEdgeStates, GraphNodeStates } from './graph'

export type AlgorithmAuxiliaryData = {
  label: string
  values: string[]
  emphasis?: 'first' | 'last'
}

export type AlgorithmGraphSnapshot = {
  startNodeId?: string
  currentNodeId?: string
  targetNodeId?: string
  visitedNodeIds?: string[]
  frontierNodeIds?: string[]
  activeEdgeIds?: string[]
  visitedEdgeIds?: string[]
  pathEdgeIds?: string[]
  traversalOrder?: string[]
}

export type AlgorithmStep = {
  id: string
  description: string
  snapshot?: AlgorithmGraphSnapshot
  nodeStates?: GraphNodeStates
  edgeStates?: GraphEdgeStates
  auxiliaryData?: AlgorithmAuxiliaryData
  metadata?: Record<string, unknown>
}
