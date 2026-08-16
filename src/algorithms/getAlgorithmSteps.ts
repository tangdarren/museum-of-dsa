import { DEMO_ALGORITHM_STEPS } from '../data/demoAlgorithmSteps'
import type { AlgorithmId } from '../types/algorithm'
import type { AlgorithmStep } from '../types/algorithmStep'
import type { GraphData } from '../types/graph'
import { generateBfsSteps } from './generateBfsSteps'
import { generateDfsSteps } from './generateDfsSteps'

export const IMPLEMENTED_ALGORITHMS: ReadonlySet<AlgorithmId> = new Set([
  'bfs',
  'dfs',
])

export function usesStartNodeSelection(algorithmId: AlgorithmId): boolean {
  return IMPLEMENTED_ALGORITHMS.has(algorithmId)
}

export function getAlgorithmSteps(
  algorithmId: AlgorithmId,
  graph: GraphData,
  startNodeId: string | null,
): AlgorithmStep[] {
  if (algorithmId === 'bfs') {
    return startNodeId ? generateBfsSteps(graph, startNodeId) : []
  }

  if (algorithmId === 'dfs') {
    return startNodeId ? generateDfsSteps(graph, startNodeId) : []
  }

  return DEMO_ALGORITHM_STEPS
}
