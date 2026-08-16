import type {
  AlgorithmAuxiliaryData,
  AlgorithmGraphSnapshot,
  AlgorithmStep,
} from '../types/algorithmStep'

type TraversalStepInput = {
  id: string
  description: string
  snapshot: AlgorithmGraphSnapshot
  auxiliaryData: AlgorithmAuxiliaryData
}

export function createTraversalStep(input: TraversalStepInput): AlgorithmStep {
  return {
    id: input.id,
    description: input.description,
    snapshot: {
      startNodeId: input.snapshot.startNodeId,
      currentNodeId: input.snapshot.currentNodeId,
      targetNodeId: input.snapshot.targetNodeId,
      visitedNodeIds: input.snapshot.visitedNodeIds
        ? [...input.snapshot.visitedNodeIds]
        : undefined,
      frontierNodeIds: input.snapshot.frontierNodeIds
        ? [...input.snapshot.frontierNodeIds]
        : undefined,
      activeEdgeIds: input.snapshot.activeEdgeIds
        ? [...input.snapshot.activeEdgeIds]
        : undefined,
      visitedEdgeIds: input.snapshot.visitedEdgeIds
        ? [...input.snapshot.visitedEdgeIds]
        : undefined,
      pathEdgeIds: input.snapshot.pathEdgeIds
        ? [...input.snapshot.pathEdgeIds]
        : undefined,
      traversalOrder: input.snapshot.traversalOrder
        ? [...input.snapshot.traversalOrder]
        : undefined,
    },
    auxiliaryData: {
      label: input.auxiliaryData.label,
      values: [...input.auxiliaryData.values],
      emphasis: input.auxiliaryData.emphasis,
    },
  }
}
