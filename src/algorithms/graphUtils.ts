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

export type WeightedNeighbor = {
  nodeId: string
  weight: number
  edgeId: string
}

export function buildWeightedAdjacency(
  graph: GraphData,
): Map<string, WeightedNeighbor[]> {
  const adjacency = new Map<string, WeightedNeighbor[]>()

  for (const node of graph.nodes) {
    adjacency.set(node.id, [])
  }

  for (const edge of graph.edges) {
    const weight = edge.weight ?? 1
    const fromNeighbors = adjacency.get(edge.source)
    const toNeighbors = adjacency.get(edge.target)

    if (fromNeighbors && !fromNeighbors.some((item) => item.nodeId === edge.target)) {
      fromNeighbors.push({ nodeId: edge.target, weight, edgeId: edge.id })
    }

    if (toNeighbors && !toNeighbors.some((item) => item.nodeId === edge.source)) {
      toNeighbors.push({ nodeId: edge.source, weight, edgeId: edge.id })
    }
  }

  for (const neighbors of adjacency.values()) {
    neighbors.sort((left, right) => compareNodeIds(left.nodeId, right.nodeId))
  }

  return adjacency
}

export function reconstructPath(
  previous: Map<string, string>,
  startNodeId: string,
  targetNodeId: string,
): string[] | null {
  if (startNodeId === targetNodeId) {
    return [startNodeId]
  }

  const path = [targetNodeId]
  const seen = new Set<string>([targetNodeId])
  let current = targetNodeId

  while (current !== startNodeId) {
    const parent = previous.get(current)

    if (!parent || seen.has(parent)) {
      return null
    }

    path.push(parent)
    seen.add(parent)
    current = parent
  }

  path.reverse()
  return path
}

export function formatMetric(value: number): string {
  if (!Number.isFinite(value)) {
    return '∞'
  }

  if (Number.isInteger(value)) {
    return String(value)
  }

  return value.toFixed(1)
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
