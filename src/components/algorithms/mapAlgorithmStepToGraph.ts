import type { AlgorithmGraphSnapshot, AlgorithmStep } from '../../types/algorithmStep'
import type { GraphEdgeState, GraphEdgeStates, GraphNodeState, GraphNodeStates } from '../../types/graph'

const NODE_STATE_PRIORITY: Record<GraphNodeState, number> = {
  default: 0,
  visited: 1,
  frontier: 2,
  target: 3,
  start: 4,
  active: 5,
}

const EDGE_STATE_PRIORITY: Record<GraphEdgeState, number> = {
  default: 0,
  visited: 1,
  path: 2,
  active: 3,
}

function assignNodeState(
  nodeStates: GraphNodeStates,
  nodeId: string,
  state: GraphNodeState,
) {
  const current = nodeStates[nodeId] ?? 'default'

  if (NODE_STATE_PRIORITY[state] >= NODE_STATE_PRIORITY[current]) {
    nodeStates[nodeId] = state
  }
}

function assignEdgeState(
  edgeStates: GraphEdgeStates,
  edgeId: string,
  state: GraphEdgeState,
) {
  const current = edgeStates[edgeId] ?? 'default'

  if (EDGE_STATE_PRIORITY[state] >= EDGE_STATE_PRIORITY[current]) {
    edgeStates[edgeId] = state
  }
}

function mapSnapshotToGraph(snapshot: AlgorithmGraphSnapshot): {
  nodeStates: GraphNodeStates
  edgeStates: GraphEdgeStates
} {
  const nodeStates: GraphNodeStates = {}
  const edgeStates: GraphEdgeStates = {}

  for (const nodeId of snapshot.visitedNodeIds ?? []) {
    assignNodeState(nodeStates, nodeId, 'visited')
  }

  for (const nodeId of snapshot.frontierNodeIds ?? []) {
    assignNodeState(nodeStates, nodeId, 'frontier')
  }

  for (const nodeId of snapshot.pathNodeIds ?? []) {
    assignNodeState(nodeStates, nodeId, 'visited')
  }

  if (snapshot.targetNodeId) {
    assignNodeState(nodeStates, snapshot.targetNodeId, 'target')
  }

  if (snapshot.startNodeId) {
    assignNodeState(nodeStates, snapshot.startNodeId, 'start')
  }

  if (snapshot.currentNodeId) {
    assignNodeState(nodeStates, snapshot.currentNodeId, 'active')
  }

  for (const edgeId of snapshot.visitedEdgeIds ?? []) {
    assignEdgeState(edgeStates, edgeId, 'visited')
  }

  for (const edgeId of snapshot.pathEdgeIds ?? []) {
    assignEdgeState(edgeStates, edgeId, 'path')
  }

  for (const edgeId of snapshot.activeEdgeIds ?? []) {
    assignEdgeState(edgeStates, edgeId, 'active')
  }

  return { nodeStates, edgeStates }
}

export function mapAlgorithmStepToGraph(step: AlgorithmStep | null): {
  nodeStates: GraphNodeStates
  edgeStates: GraphEdgeStates
} {
  if (step?.snapshot) {
    return mapSnapshotToGraph(step.snapshot)
  }

  return {
    nodeStates: step?.nodeStates ?? {},
    edgeStates: step?.edgeStates ?? {},
  }
}
