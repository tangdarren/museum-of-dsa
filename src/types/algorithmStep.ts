import type { GraphEdgeStates, GraphNodeStates } from './graph'

export type AlgorithmAuxiliaryData = {
  label: string
  values: string[]
}

export type AlgorithmStep = {
  id: string
  description: string
  nodeStates?: GraphNodeStates
  edgeStates?: GraphEdgeStates
  auxiliaryData?: AlgorithmAuxiliaryData
  metadata?: Record<string, unknown>
}
