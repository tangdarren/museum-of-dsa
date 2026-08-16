import type {
  AlgorithmAuxiliaryData,
  AlgorithmInspection,
  AlgorithmSortingSnapshot,
  AlgorithmStep,
} from '../types/algorithmStep'
import {
  copySortingSnapshot,
  createSortingMetricsTable,
} from './sortingShared'

type SortingStepInput = {
  id: string
  description: string
  snapshot: AlgorithmSortingSnapshot
  auxiliaryData?: AlgorithmAuxiliaryData
  inspection?: AlgorithmInspection
}

export function createSortingStep(input: SortingStepInput): AlgorithmStep {
  const sortingSnapshot = copySortingSnapshot(input.snapshot)

  return {
    id: input.id,
    description: input.description,
    sortingSnapshot,
    metrics: createSortingMetricsTable(sortingSnapshot.metrics),
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
  }
}
