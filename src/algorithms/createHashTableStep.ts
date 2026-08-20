import type {
  AlgorithmAuxiliaryData,
  AlgorithmHashTableSnapshot,
  AlgorithmInspection,
  AlgorithmMetricTable,
  AlgorithmPathResult,
  AlgorithmStep,
} from '../types/algorithmStep'
import {
  copyHashTableSnapshot,
  createHashTableMetricsTable,
} from './hashTableShared'

type HashTableStepInput = {
  id: string
  description: string
  snapshot: AlgorithmHashTableSnapshot
  auxiliaryData?: AlgorithmAuxiliaryData
  inspection?: AlgorithmInspection
  metrics?: AlgorithmMetricTable
  pathResult?: AlgorithmPathResult
}

export function createHashTableStep(input: HashTableStepInput): AlgorithmStep {
  const hashTableSnapshot = copyHashTableSnapshot(input.snapshot)

  return {
    id: input.id,
    description: input.description,
    hashTableSnapshot,
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
      : createHashTableMetricsTable(hashTableSnapshot.metrics),
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
