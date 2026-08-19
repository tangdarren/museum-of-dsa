import type {
  AlgorithmAuxiliaryData,
  AlgorithmInspection,
  AlgorithmLinkedListSnapshot,
  AlgorithmMetricTable,
  AlgorithmPathResult,
  AlgorithmStep,
} from '../types/algorithmStep'
import {
  copyLinkedListSnapshot,
  createLinkedListMetricsTable,
} from './linkedListShared'

type LinkedListStepInput = {
  id: string
  description: string
  snapshot: AlgorithmLinkedListSnapshot
  auxiliaryData?: AlgorithmAuxiliaryData
  inspection?: AlgorithmInspection
  metrics?: AlgorithmMetricTable
  pathResult?: AlgorithmPathResult
}

export function createLinkedListStep(input: LinkedListStepInput): AlgorithmStep {
  const linkedListSnapshot = copyLinkedListSnapshot(input.snapshot)

  return {
    id: input.id,
    description: input.description,
    linkedListSnapshot,
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
      : createLinkedListMetricsTable(linkedListSnapshot.metrics),
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
