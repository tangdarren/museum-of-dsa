import type { GraphEdgeStates, GraphNodeStates } from './graph'
import type { SortingIndexRange, SortingMetrics } from './sorting'
import type { TreeEdge, TreeMetrics, TreeNode } from './tree'

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

export type AlgorithmSortingSnapshot = {
  values: number[]
  metrics: SortingMetrics
  comparedIndices?: number[]
  swappedIndices?: number[]
  writtenIndices?: number[]
  pivotIndex?: number
  activeRanges?: SortingIndexRange[]
  sortedIndices?: number[]
}

export type AlgorithmTreeSnapshot = {
  rootNodeId: string | null
  nodes: TreeNode[]
  edges: TreeEdge[]
  metrics: TreeMetrics
  currentNodeId?: string
  targetNodeId?: string
  visitedNodeIds?: string[]
  frontierNodeIds?: string[]
  pathNodeIds?: string[]
  comparedNodeIds?: string[]
  foundNodeId?: string
  insertingNodeId?: string
  activeEdgeIds?: string[]
  visitedEdgeIds?: string[]
  pathEdgeIds?: string[]
  traversalOrder?: string[]
}

export type AlgorithmStep = {
  id: string
  description: string
  snapshot?: AlgorithmGraphSnapshot
  sortingSnapshot?: AlgorithmSortingSnapshot
  treeSnapshot?: AlgorithmTreeSnapshot
  nodeStates?: GraphNodeStates
  edgeStates?: GraphEdgeStates
  auxiliaryData?: AlgorithmAuxiliaryData
  metrics?: AlgorithmMetricTable
  inspection?: AlgorithmInspection
  pathResult?: AlgorithmPathResult
  metadata?: Record<string, unknown>
}
