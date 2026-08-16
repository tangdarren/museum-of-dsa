import type { AlgorithmMetricTable } from '../types/algorithmStep'
import type { GraphData } from '../types/graph'
import { findEdgeId, formatMetric } from './graphUtils'

export function collectFrontier(
  nodeIds: string[],
  distances: Map<string, number>,
  settled: Set<string>,
  currentNodeId?: string,
): string[] {
  return nodeIds.filter(
    (nodeId) =>
      nodeId !== currentNodeId &&
      !settled.has(nodeId) &&
      Number.isFinite(distances.get(nodeId)),
  )
}

export function collectPathEdges(
  graph: GraphData,
  path: string[],
): string[] {
  const edgeIds: string[] = []

  for (let index = 0; index < path.length - 1; index += 1) {
    const edgeId = findEdgeId(graph, path[index], path[index + 1])

    if (edgeId) {
      edgeIds.push(edgeId)
    }
  }

  return edgeIds
}

export function createDistanceTable(
  nodeIds: string[],
  distances: Map<string, number>,
  currentNodeId?: string,
): AlgorithmMetricTable {
  return {
    label: 'Distances',
    columns: ['Node', 'Distance'],
    rows: nodeIds.map((nodeId) => ({
      id: nodeId,
      cells: [nodeId, formatMetric(distances.get(nodeId) ?? Number.POSITIVE_INFINITY)],
      emphasized: nodeId === currentNodeId,
    })),
  }
}

export function createScoreTable(
  nodeIds: string[],
  gScores: Map<string, number>,
  heuristic: (nodeId: string) => number,
  currentNodeId?: string,
): AlgorithmMetricTable {
  const rows = nodeIds
    .filter(
      (nodeId) =>
        nodeId === currentNodeId || Number.isFinite(gScores.get(nodeId)),
    )
    .map((nodeId) => {
      const g = gScores.get(nodeId) ?? Number.POSITIVE_INFINITY
      const h = heuristic(nodeId)
      const f = Number.isFinite(g) ? g + h : Number.POSITIVE_INFINITY

      return {
        id: nodeId,
        cells: [nodeId, formatMetric(g), formatMetric(h), formatMetric(f)],
        emphasized: nodeId === currentNodeId,
      }
    })

  return {
    label: 'Scores',
    columns: ['Node', 'g', 'h', 'f'],
    rows,
  }
}
