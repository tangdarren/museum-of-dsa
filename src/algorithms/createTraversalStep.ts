import type {
  AlgorithmAuxiliaryData,
  AlgorithmGraphSnapshot,
  AlgorithmInspection,
  AlgorithmMetricTable,
  AlgorithmPathResult,
  AlgorithmStep,
} from '../types/algorithmStep'

type TraversalStepInput = {
  id: string
  description: string
  snapshot: AlgorithmGraphSnapshot
  auxiliaryData?: AlgorithmAuxiliaryData
  metrics?: AlgorithmMetricTable
  inspection?: AlgorithmInspection
  pathResult?: AlgorithmPathResult
}

function copyList(values?: string[]) {
  return values ? [...values] : undefined
}

export function createTraversalStep(input: TraversalStepInput): AlgorithmStep {
  return {
    id: input.id,
    description: input.description,
    snapshot: {
      startNodeId: input.snapshot.startNodeId,
      currentNodeId: input.snapshot.currentNodeId,
      targetNodeId: input.snapshot.targetNodeId,
      visitedNodeIds: copyList(input.snapshot.visitedNodeIds),
      frontierNodeIds: copyList(input.snapshot.frontierNodeIds),
      pathNodeIds: copyList(input.snapshot.pathNodeIds),
      activeEdgeIds: copyList(input.snapshot.activeEdgeIds),
      visitedEdgeIds: copyList(input.snapshot.visitedEdgeIds),
      pathEdgeIds: copyList(input.snapshot.pathEdgeIds),
      traversalOrder: copyList(input.snapshot.traversalOrder),
    },
    auxiliaryData: input.auxiliaryData
      ? {
          label: input.auxiliaryData.label,
          values: [...input.auxiliaryData.values],
          emphasis: input.auxiliaryData.emphasis,
        }
      : undefined,
    metrics: input.metrics
      ? {
          label: input.metrics.label,
          columns: [...input.metrics.columns],
          rows: input.metrics.rows.map((row) => ({
            id: row.id,
            cells: [...row.cells],
            emphasized: row.emphasized,
          })),
        }
      : undefined,
    inspection: input.inspection
      ? {
          title: input.inspection.title,
          lines: [...input.inspection.lines],
        }
      : undefined,
    pathResult: input.pathResult
      ? {
          found: input.pathResult.found,
          nodes: [...input.pathResult.nodes],
          cost: input.pathResult.cost,
          exploredCount: input.pathResult.exploredCount,
        }
      : undefined,
  }
}
