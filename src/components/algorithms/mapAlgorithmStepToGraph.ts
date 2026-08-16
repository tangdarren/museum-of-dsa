import type { AlgorithmStep } from '../../types/algorithmStep'
import type { GraphEdgeStates, GraphNodeStates } from '../../types/graph'

export function mapAlgorithmStepToGraph(step: AlgorithmStep | null): {
  nodeStates: GraphNodeStates
  edgeStates: GraphEdgeStates
} {
  return {
    nodeStates: step?.nodeStates ?? {},
    edgeStates: step?.edgeStates ?? {},
  }
}
