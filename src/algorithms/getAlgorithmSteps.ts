import type { AlgorithmId } from '../types/algorithm'
import type { AlgorithmStep } from '../types/algorithmStep'
import type { GraphData } from '../types/graph'
import { generateAStarSteps } from './generateAStarSteps'
import { generateBfsSteps } from './generateBfsSteps'
import { generateDfsSteps } from './generateDfsSteps'
import { generateDijkstraSteps } from './generateDijkstraSteps'

export const IMPLEMENTED_ALGORITHMS: ReadonlySet<AlgorithmId> = new Set([
  'bfs',
  'dfs',
  'dijkstra',
  'astar',
])

export function usesStartNodeSelection(algorithmId: AlgorithmId): boolean {
  return IMPLEMENTED_ALGORITHMS.has(algorithmId)
}

export function usesTargetNodeSelection(algorithmId: AlgorithmId): boolean {
  return algorithmId === 'dijkstra' || algorithmId === 'astar'
}

export function getAlgorithmSteps(
  algorithmId: AlgorithmId,
  graph: GraphData,
  startNodeId: string | null,
  targetNodeId: string | null = null,
): AlgorithmStep[] {
  if (algorithmId === 'bfs') {
    return startNodeId ? generateBfsSteps(graph, startNodeId) : []
  }

  if (algorithmId === 'dfs') {
    return startNodeId ? generateDfsSteps(graph, startNodeId) : []
  }

  if (algorithmId === 'dijkstra') {
    return startNodeId && targetNodeId
      ? generateDijkstraSteps(graph, startNodeId, targetNodeId)
      : []
  }

  if (algorithmId === 'astar') {
    return startNodeId && targetNodeId
      ? generateAStarSteps(graph, startNodeId, targetNodeId)
      : []
  }

  return []
}
