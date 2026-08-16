import type { AlgorithmStep } from '../types/algorithmStep'
import type { GraphData } from '../types/graph'
import { createTraversalStep } from './createTraversalStep'
import {
  buildWeightedAdjacency,
  compareNodeIds,
  formatMetric,
  reconstructPath,
} from './graphUtils'
import {
  collectFrontier,
  collectPathEdges,
  createDistanceTable,
} from './pathfindingShared'
import { createPriorityQueue } from './priorityQueue'

export function generateDijkstraSteps(
  graph: GraphData,
  startNodeId: string,
  targetNodeId: string,
): AlgorithmStep[] {
  const adjacency = buildWeightedAdjacency(graph)
  const nodeIds = graph.nodes.map((node) => node.id)
  const distances = new Map<string, number>(
    nodeIds.map((nodeId) => [nodeId, Number.POSITIVE_INFINITY]),
  )
  const previous = new Map<string, string>()
  const settled = new Set<string>()
  const visitedEdges: string[] = []
  const steps: AlgorithmStep[] = []
  let stepIndex = 0

  distances.set(startNodeId, 0)

  const queue = createPriorityQueue<{ nodeId: string; distance: number }>(
    (left, right) =>
      left.distance === right.distance
        ? compareNodeIds(left.nodeId, right.nodeId)
        : left.distance - right.distance,
  )
  queue.push({ nodeId: startNodeId, distance: 0 })

  const addStep = (
    description: string,
    currentNodeId: string | undefined,
    activeEdgeIds: string[],
    extras: {
      inspection?: AlgorithmStep['inspection']
      path?: string[]
      cost?: number | null
      found?: boolean
    } = {},
  ) => {
    const path = extras.path
    const found = extras.found ?? Boolean(path)
    steps.push(
      createTraversalStep({
        id: `dijkstra-${stepIndex}`,
        description,
        snapshot: {
          startNodeId,
          targetNodeId,
          currentNodeId,
          visitedNodeIds: [...settled].filter((nodeId) => nodeId !== currentNodeId),
          frontierNodeIds: collectFrontier(
            nodeIds,
            distances,
            settled,
            currentNodeId,
          ),
          pathNodeIds: path,
          activeEdgeIds,
          visitedEdgeIds: [...visitedEdges],
          pathEdgeIds: path ? collectPathEdges(graph, path) : [],
        },
        metrics: createDistanceTable(nodeIds, distances, currentNodeId),
        inspection: extras.inspection,
        pathResult: path
          ? {
              found,
              nodes: path,
              cost: extras.cost ?? null,
            }
          : extras.found === false
            ? {
                found: false,
                nodes: [],
                cost: null,
              }
            : undefined,
      }),
    )
    stepIndex += 1
  }

  addStep('Set the start distance to 0 and all others to ∞.', startNodeId, [])

  if (startNodeId === targetNodeId) {
    settled.add(startNodeId)
    addStep(
      `Visit ${startNodeId}. It has the smallest known distance.`,
      startNodeId,
      [],
    )
    addStep('Shortest path found.', undefined, [], {
      path: [startNodeId],
      cost: 0,
    })
    return steps
  }

  while (!queue.isEmpty()) {
    const item = queue.pop()

    if (!item || settled.has(item.nodeId)) {
      continue
    }

    if (item.distance !== distances.get(item.nodeId)) {
      continue
    }

    const current = item.nodeId
    settled.add(current)
    addStep(
      `Visit ${current}. It has the smallest known distance.`,
      current,
      [],
    )

    if (current === targetNodeId) {
      const path = reconstructPath(previous, startNodeId, targetNodeId) ?? []
      addStep('Shortest path found.', undefined, [], {
        path,
        cost: distances.get(targetNodeId) ?? null,
        found: path.length > 0,
      })
      return steps
    }

    for (const neighbor of adjacency.get(current) ?? []) {
      if (settled.has(neighbor.nodeId)) {
        continue
      }

      const currentDistance =
        distances.get(neighbor.nodeId) ?? Number.POSITIVE_INFINITY
      const throughDistance =
        (distances.get(current) ?? Number.POSITIVE_INFINITY) + neighbor.weight
      const improved = throughDistance < currentDistance

      if (improved) {
        distances.set(neighbor.nodeId, throughDistance)
        previous.set(neighbor.nodeId, current)
        queue.push({ nodeId: neighbor.nodeId, distance: throughDistance })
      }

      addStep(
        improved
          ? `${current} → ${neighbor.nodeId} is cheaper. Update ${neighbor.nodeId} from ${formatMetric(currentDistance)} to ${formatMetric(throughDistance)}.`
          : `${current} → ${neighbor.nodeId} is not cheaper. Keep ${neighbor.nodeId} at ${formatMetric(currentDistance)}.`,
        current,
        [neighbor.edgeId],
        {
          inspection: {
            title: `Checking ${current} → ${neighbor.nodeId}`,
            lines: [
              `Current: ${formatMetric(currentDistance)}`,
              `Through ${current}: ${formatMetric(throughDistance)}`,
              improved
                ? `Update to ${formatMetric(throughDistance)}`
                : 'No update',
            ],
          },
        },
      )
      visitedEdges.push(neighbor.edgeId)
    }
  }

  addStep('No path found.', undefined, [], { found: false })
  return steps
}
