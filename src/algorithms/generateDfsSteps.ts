import type { AlgorithmStep } from '../types/algorithmStep'
import type { GraphData } from '../types/graph'
import { createTraversalStep } from './createTraversalStep'
import { buildAdjacencyList, findEdgeId } from './graphUtils'

export function generateDfsSteps(
  graph: GraphData,
  startNodeId: string,
): AlgorithmStep[] {
  const adjacency = buildAdjacencyList(graph)
  const stack = [startNodeId]
  const onStack = new Set<string>([startNodeId])
  const visited = new Set<string>()
  const visitOrder: string[] = []
  const visitedEdges: string[] = []
  const steps: AlgorithmStep[] = [
    createTraversalStep({
      id: 'dfs-start',
      description: `Start at ${startNodeId} and push it onto the stack.`,
      snapshot: {
        startNodeId,
        currentNodeId: startNodeId,
        visitedNodeIds: [],
        frontierNodeIds: [startNodeId],
        activeEdgeIds: [],
        visitedEdgeIds: [],
      },
      auxiliaryData: {
        label: 'Stack',
        values: [startNodeId],
        emphasis: 'last',
      },
    }),
  ]

  while (stack.length > 0) {
    const current = stack.pop()

    if (!current) {
      break
    }

    onStack.delete(current)
    visited.add(current)
    visitOrder.push(current)

    const discoveredNeighbors: string[] = []
    const activeEdgeIds: string[] = []
    const neighbors = [...(adjacency.get(current) ?? [])].reverse()

    for (const neighbor of neighbors) {
      if (visited.has(neighbor) || onStack.has(neighbor)) {
        continue
      }

      stack.push(neighbor)
      onStack.add(neighbor)
      discoveredNeighbors.unshift(neighbor)

      const edgeId = findEdgeId(graph, current, neighbor)

      if (edgeId) {
        activeEdgeIds.unshift(edgeId)
      }
    }

    const next = stack[stack.length - 1]
    let description = `Visit ${current}.`

    if (discoveredNeighbors.length > 0 && next) {
      description = `Visit ${current} and continue deeper to ${next}.`
    } else if (stack.length > 0) {
      description = 'No unused neighbors here. Continue from the stack.'
    } else {
      description = `Visit ${current}. No unvisited neighbors remain.`
    }

    steps.push(
      createTraversalStep({
        id: `dfs-visit-${current}`,
        description,
        snapshot: {
          startNodeId,
          currentNodeId: current,
          visitedNodeIds: visitOrder.filter((id) => id !== current),
          frontierNodeIds: [...stack],
          activeEdgeIds,
          visitedEdgeIds: [...visitedEdges],
        },
        auxiliaryData: {
          label: 'Stack',
          values: [...stack],
          emphasis: 'last',
        },
      }),
    )

    visitedEdges.push(...activeEdgeIds)
  }

  steps.push(
    createTraversalStep({
      id: 'dfs-complete',
      description: 'Traversal complete.',
      snapshot: {
        startNodeId,
        visitedNodeIds: [...visitOrder],
        frontierNodeIds: [],
        activeEdgeIds: [],
        visitedEdgeIds: [...visitedEdges],
        traversalOrder: [...visitOrder],
      },
      auxiliaryData: {
        label: 'Stack',
        values: [],
        emphasis: 'last',
      },
    }),
  )

  return steps
}
