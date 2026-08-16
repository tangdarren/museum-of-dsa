import type { AlgorithmStep } from '../types/algorithmStep'
import type { GraphData } from '../types/graph'
import { createTraversalStep } from './createTraversalStep'
import { createHeuristic } from './heuristic'
import {
  buildWeightedAdjacency,
  compareNodeIds,
  formatMetric,
  reconstructPath,
} from './graphUtils'
import {
  collectFrontier,
  collectPathEdges,
  createScoreTable,
} from './pathfindingShared'
import { createPriorityQueue } from './priorityQueue'

export function generateAStarSteps(
  graph: GraphData,
  startNodeId: string,
  targetNodeId: string,
): AlgorithmStep[] {
  const adjacency = buildWeightedAdjacency(graph)
  const heuristic = createHeuristic(graph, targetNodeId)
  const nodeIds = graph.nodes.map((node) => node.id)
  const gScores = new Map<string, number>(
    nodeIds.map((nodeId) => [nodeId, Number.POSITIVE_INFINITY]),
  )
  const previous = new Map<string, string>()
  const settled = new Set<string>()
  const visitedEdges: string[] = []
  const steps: AlgorithmStep[] = []
  let stepIndex = 0

  gScores.set(startNodeId, 0)

  const queue = createPriorityQueue<{
    nodeId: string
    g: number
    h: number
    f: number
  }>((left, right) => {
    if (left.f !== right.f) {
      return left.f - right.f
    }

    if (left.h !== right.h) {
      return left.h - right.h
    }

    return compareNodeIds(left.nodeId, right.nodeId)
  })
  queue.push({
    nodeId: startNodeId,
    g: 0,
    h: heuristic(startNodeId),
    f: heuristic(startNodeId),
  })

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
        id: `astar-${stepIndex}`,
        description,
        snapshot: {
          startNodeId,
          targetNodeId,
          currentNodeId,
          visitedNodeIds: [...settled].filter((nodeId) => nodeId !== currentNodeId),
          frontierNodeIds: collectFrontier(
            nodeIds,
            gScores,
            settled,
            currentNodeId,
          ),
          pathNodeIds: path,
          activeEdgeIds,
          visitedEdgeIds: [...visitedEdges],
          pathEdgeIds: path ? collectPathEdges(graph, path) : [],
        },
        metrics: createScoreTable(nodeIds, gScores, heuristic, currentNodeId),
        inspection: extras.inspection,
        pathResult: path
          ? {
              found,
              nodes: path,
              cost: extras.cost ?? null,
              exploredCount: settled.size,
            }
          : extras.found === false
            ? {
                found: false,
                nodes: [],
                cost: null,
                exploredCount: settled.size,
              }
            : undefined,
      }),
    )
    stepIndex += 1
  }

  addStep(
    `Start at ${startNodeId}. Estimate the cost to the target.`,
    startNodeId,
    [],
  )

  if (startNodeId === targetNodeId) {
    settled.add(startNodeId)
    addStep(
      `${startNodeId} has the lowest estimated total cost, so explore it next.`,
      startNodeId,
      [],
    )
    addStep('Target reached. Reconstruct the shortest path.', undefined, [], {
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

    if (item.g !== gScores.get(item.nodeId)) {
      continue
    }

    const current = item.nodeId
    settled.add(current)
    addStep(
      `${current} has the lowest estimated total cost, so explore it next.`,
      current,
      [],
    )

    if (current === targetNodeId) {
      const path = reconstructPath(previous, startNodeId, targetNodeId) ?? []
      addStep('Target reached. Reconstruct the shortest path.', undefined, [], {
        path,
        cost: gScores.get(targetNodeId) ?? null,
        found: path.length > 0,
      })
      return steps
    }

    for (const neighbor of adjacency.get(current) ?? []) {
      if (settled.has(neighbor.nodeId)) {
        continue
      }

      const currentG =
        gScores.get(neighbor.nodeId) ?? Number.POSITIVE_INFINITY
      const throughG =
        (gScores.get(current) ?? Number.POSITIVE_INFINITY) + neighbor.weight
      const improved = throughG < currentG
      const h = heuristic(neighbor.nodeId)
      const f = throughG + h

      if (improved) {
        gScores.set(neighbor.nodeId, throughG)
        previous.set(neighbor.nodeId, current)
        queue.push({
          nodeId: neighbor.nodeId,
          g: throughG,
          h,
          f,
        })
      }

      addStep(
        improved
          ? `Checking ${current} → ${neighbor.nodeId} lowers g(${neighbor.nodeId}) from ${formatMetric(currentG)} to ${formatMetric(throughG)}. f(${neighbor.nodeId}) = g(${neighbor.nodeId}) + h(${neighbor.nodeId}) = ${formatMetric(throughG)} + ${formatMetric(h)} = ${formatMetric(f)}.`
          : `Checking ${current} → ${neighbor.nodeId} does not improve g(${neighbor.nodeId}).`,
        current,
        [neighbor.edgeId],
        {
          inspection: {
            title: `Checking ${current} → ${neighbor.nodeId}`,
            lines: [
              `Current: ${formatMetric(currentG)}`,
              `Through ${current}: ${formatMetric(throughG)}`,
              improved
                ? `f(${neighbor.nodeId}) = ${formatMetric(throughG)} + ${formatMetric(h)} = ${formatMetric(f)}`
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
