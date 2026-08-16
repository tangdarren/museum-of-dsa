import type { GraphData } from '../types/graph'

export function compareNodeIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

export function buildAdjacencyList(graph: GraphData): Map<string, string[]> {
  const adjacency = new Map<string, string[]>()

  for (const node of graph.nodes) {
    adjacency.set(node.id, [])
  }

  for (const edge of graph.edges) {
    const fromNeighbors = adjacency.get(edge.source)
    const toNeighbors = adjacency.get(edge.target)

    if (fromNeighbors && !fromNeighbors.includes(edge.target)) {
      fromNeighbors.push(edge.target)
    }

    if (toNeighbors && !toNeighbors.includes(edge.source)) {
      toNeighbors.push(edge.source)
    }
  }

  for (const neighbors of adjacency.values()) {
    neighbors.sort(compareNodeIds)
  }

  return adjacency
}

export function findEdgeId(
  graph: GraphData,
  sourceId: string,
  targetId: string,
): string | undefined {
  return graph.edges.find(
    (edge) =>
      (edge.source === sourceId && edge.target === targetId) ||
      (edge.source === targetId && edge.target === sourceId),
  )?.id
}

export function formatNodeList(ids: string[]): string {
  if (ids.length === 0) {
    return ''
  }

  if (ids.length === 1) {
    return ids[0]
  }

  if (ids.length === 2) {
    return `${ids[0]} and ${ids[1]}`
  }

  return `${ids.slice(0, -1).join(', ')}, and ${ids[ids.length - 1]}`
}
