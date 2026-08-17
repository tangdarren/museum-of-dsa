import type {
  AlgorithmAuxiliaryData,
  AlgorithmInspection,
  AlgorithmMetricTable,
  AlgorithmPathResult,
  AlgorithmStep,
  AlgorithmTreeSnapshot,
} from '../types/algorithmStep'
import { copyTreeSnapshot, createTreeMetricsTable } from './treeShared'

type TreeStepInput = {
  id: string
  description: string
  snapshot: AlgorithmTreeSnapshot
  auxiliaryData?: AlgorithmAuxiliaryData
  inspection?: AlgorithmInspection
  metrics?: AlgorithmMetricTable
  pathResult?: AlgorithmPathResult
}

export function createTreeStep(input: TreeStepInput): AlgorithmStep {
  const treeSnapshot = copyTreeSnapshot(input.snapshot)

  return {
    id: input.id,
    description: input.description,
    treeSnapshot,
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
      : createTreeMetricsTable(treeSnapshot.metrics),
    auxiliaryData: input.auxiliaryData
      ? {
          label: input.auxiliaryData.label,
          values: [...input.auxiliaryData.values],
          emphasis: input.auxiliaryData.emphasis,
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
