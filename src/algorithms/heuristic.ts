import type { GraphData } from '../types/graph'
import type { Vec3 } from '../navigation/destinations'

export function euclideanDistance(from: Vec3, to: Vec3): number {
  const dx = from[0] - to[0]
  const dy = from[1] - to[1]
  const dz = from[2] - to[2]
  return Math.hypot(dx, dy, dz)
}

export function computeAdmissibleHeuristicScale(graph: GraphData): number {
  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]))
  let scale = Number.POSITIVE_INFINITY

  for (const edge of graph.edges) {
    const source = nodesById.get(edge.source)
    const target = nodesById.get(edge.target)

    if (!source || !target) {
      continue
    }

    const distance = euclideanDistance(source.position, target.position)
    const weight = edge.weight ?? 1

    if (distance > 0) {
      scale = Math.min(scale, weight / distance)
    }
  }

  return Number.isFinite(scale) ? scale : 1
}

export function createHeuristic(
  graph: GraphData,
  targetNodeId: string,
): (nodeId: string) => number {
  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]))
  const target = nodesById.get(targetNodeId)
  const scale = computeAdmissibleHeuristicScale(graph)

  return (nodeId: string) => {
    if (!target) {
      return 0
    }

    if (nodeId === targetNodeId) {
      return 0
    }

    const node = nodesById.get(nodeId)

    if (!node) {
      return 0
    }

    return scale * euclideanDistance(node.position, target.position)
  }
}
