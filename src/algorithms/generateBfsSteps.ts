import type { AlgorithmStep } from '../types/algorithmStep'
import type { GraphData } from '../types/graph'
import { createTraversalStep } from './createTraversalStep'
import {
  buildAdjacencyList,
  findEdgeId,
  formatNodeList,
} from './graphUtils'

export function generateBfsSteps(
  graph: GraphData,
  startNodeId: string,
): AlgorithmStep[] {
  const adjacency = buildAdjacencyList(graph)
  const queue = [startNodeId]
  const discovered = new Set<string>([startNodeId])
  const visited: string[] = []
  const visitedEdges: string[] = []
  const steps: AlgorithmStep[] = [
    createTraversalStep({
      id: 'bfs-start',
      description: `Start at ${startNodeId} and add it to the queue.`,
      snapshot: {
        startNodeId,
        currentNodeId: startNodeId,
        visitedNodeIds: [],
        frontierNodeIds: [startNodeId],
        activeEdgeIds: [],
        visitedEdgeIds: [],
      },
      auxiliaryData: {
        label: 'Queue',
        values: [startNodeId],
        emphasis: 'first',
      },
    }),
  ]

  while (queue.length > 0) {
    const current = queue.shift()

    if (!current) {
      break
    }

    visited.push(current)

    const discoveredNeighbors: string[] = []
    const activeEdgeIds: string[] = []

    for (const neighbor of adjacency.get(current) ?? []) {
      if (discovered.has(neighbor)) {
        continue
      }

      discovered.add(neighbor)
      queue.push(neighbor)
      discoveredNeighbors.push(neighbor)

      const edgeId = findEdgeId(graph, current, neighbor)

      if (edgeId) {
        activeEdgeIds.push(edgeId)
      }
    }

    let description = `Visit ${current}. No unvisited neighbors remain.`

    if (discoveredNeighbors.length === 1) {
      description = `Visit ${current}. ${discoveredNeighbors[0]} is unvisited, so add it to the queue.`
    } else if (discoveredNeighbors.length > 1) {
      description = `Visit ${current} and add ${formatNodeList(discoveredNeighbors)} to the queue.`
    }

    steps.push(
      createTraversalStep({
        id: `bfs-visit-${current}`,
        description,
        snapshot: {
          startNodeId,
          currentNodeId: current,
          visitedNodeIds: visited.filter((id) => id !== current),
          frontierNodeIds: [...queue],
          activeEdgeIds,
          visitedEdgeIds: [...visitedEdges],
        },
        auxiliaryData: {
          label: 'Queue',
          values: [...queue],
          emphasis: 'first',
        },
      }),
    )

    visitedEdges.push(...activeEdgeIds)
  }

  steps.push(
    createTraversalStep({
      id: 'bfs-complete',
      description: 'Traversal complete.',
      snapshot: {
        startNodeId,
        visitedNodeIds: [...visited],
        frontierNodeIds: [],
        activeEdgeIds: [],
        visitedEdgeIds: [...visitedEdges],
        traversalOrder: [...visited],
      },
      auxiliaryData: {
        label: 'Queue',
        values: [],
        emphasis: 'first',
      },
    }),
  )

  return steps
}
