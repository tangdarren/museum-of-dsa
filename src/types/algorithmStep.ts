import type { GraphEdgeStates, GraphNodeStates } from './graph'

export type AlgorithmAuxiliaryData = {
  label: string
  values: string[]
  emphasis?: 'first' | 'last'
}

export type AlgorithmMetricRow = {
  id: string
  cells: string[]
  emphasized?: boolean
}

export type AlgorithmMetricTable = {
  label: string
  columns: string[]
  rows: AlgorithmMetricRow[]
}

export type AlgorithmInspection = {
  title: string
  lines: string[]
}

export type AlgorithmPathResult = {
  found: boolean
  nodes: string[]
  cost: number | null
  exploredCount?: number
}

export type AlgorithmGraphSnapshot = {
  startNodeId?: string
  currentNodeId?: string
  targetNodeId?: string
  visitedNodeIds?: string[]
  frontierNodeIds?: string[]
  pathNodeIds?: string[]
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
  metrics?: AlgorithmMetricTable
  inspection?: AlgorithmInspection
  pathResult?: AlgorithmPathResult
  metadata?: Record<string, unknown>
}
