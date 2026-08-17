import type {
  AlgorithmAuxiliaryData,
  AlgorithmInspection,
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
}

export function createTreeStep(input: TreeStepInput): AlgorithmStep {
  const treeSnapshot = copyTreeSnapshot(input.snapshot)

  return {
    id: input.id,
    description: input.description,
    treeSnapshot,
    metrics: createTreeMetricsTable(treeSnapshot.metrics),
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
