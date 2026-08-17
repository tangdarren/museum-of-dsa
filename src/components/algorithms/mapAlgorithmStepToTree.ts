import type { AlgorithmTreeSnapshot } from '../../types/algorithmStep'
import type {
  TreeEdgeState,
  TreeEdgeStates,
  TreeNodeState,
  TreeNodeStates,
} from '../../types/tree'

const TRAVERSAL_NODE_PRIORITY: Record<TreeNodeState, number> = {
  default: 0,
  frontier: 1,
  visited: 2,
  target: 3,
  found: 4,
  active: 5,
}

const SEARCH_NODE_PRIORITY: Record<TreeNodeState, number> = {
  default: 0,
  visited: 1,
  frontier: 2,
  target: 3,
  found: 4,
  active: 5,
}

const EDGE_STATE_PRIORITY: Record<TreeEdgeState, number> = {
  default: 0,
  visited: 1,
  path: 2,
  active: 3,
}

function assignNodeState(
  nodeStates: TreeNodeStates,
  nodeId: string,
  state: TreeNodeState,
  priority: Record<TreeNodeState, number>,
) {
  const current = nodeStates[nodeId] ?? 'default'

  if (priority[state] >= priority[current]) {
    nodeStates[nodeId] = state
  }
}

function assignEdgeState(
  edgeStates: TreeEdgeStates,
  edgeId: string,
  state: TreeEdgeState,
) {
  const current = edgeStates[edgeId] ?? 'default'

  if (EDGE_STATE_PRIORITY[state] >= EDGE_STATE_PRIORITY[current]) {
    edgeStates[edgeId] = state
  }
}

function findEdgeId(
  snapshot: AlgorithmTreeSnapshot,
  sourceId: string,
  targetId: string,
): string | undefined {
  return snapshot.edges.find(
    (edge) => edge.source === sourceId && edge.target === targetId,
  )?.id
}

function collectPathEdgeIds(snapshot: AlgorithmTreeSnapshot): string[] {
  const ids = [...(snapshot.pathEdgeIds ?? [])]
  const path = snapshot.pathNodeIds ?? []

  for (let index = 0; index < path.length - 1; index += 1) {
    const edgeId = findEdgeId(snapshot, path[index], path[index + 1])

    if (edgeId && !ids.includes(edgeId)) {
      ids.push(edgeId)
    }
  }

  return ids
}

export function mapTreeSnapshotToStates(snapshot: AlgorithmTreeSnapshot | null): {
  nodeStates: TreeNodeStates
  edgeStates: TreeEdgeStates
} {
  if (!snapshot) {
    return {
      nodeStates: {},
      edgeStates: {},
    }
  }

  const isSearch =
    snapshot.targetValue !== undefined ||
    snapshot.searchResult !== undefined ||
    Boolean(snapshot.foundNodeId)
  const nodePriority = isSearch ? SEARCH_NODE_PRIORITY : TRAVERSAL_NODE_PRIORITY
  const nodeStates: TreeNodeStates = {}
  const edgeStates: TreeEdgeStates = {}

  for (const nodeId of snapshot.visitedNodeIds ?? []) {
    assignNodeState(nodeStates, nodeId, 'visited', nodePriority)
  }

  for (const nodeId of snapshot.traversalOrder ?? []) {
    assignNodeState(nodeStates, nodeId, 'visited', nodePriority)
  }

  for (const nodeId of snapshot.pathNodeIds ?? []) {
    assignNodeState(nodeStates, nodeId, 'frontier', nodePriority)
  }

  if (snapshot.targetNodeId) {
    assignNodeState(nodeStates, snapshot.targetNodeId, 'target', nodePriority)
  }

  if (snapshot.foundNodeId) {
    assignNodeState(nodeStates, snapshot.foundNodeId, 'found', nodePriority)
  }

  if (snapshot.currentNodeId) {
    assignNodeState(nodeStates, snapshot.currentNodeId, 'active', nodePriority)
  }

  for (const edgeId of snapshot.visitedEdgeIds ?? []) {
    assignEdgeState(edgeStates, edgeId, 'visited')
  }

  for (const edgeId of collectPathEdgeIds(snapshot)) {
    assignEdgeState(edgeStates, edgeId, 'path')
  }

  for (const edgeId of snapshot.activeEdgeIds ?? []) {
    assignEdgeState(edgeStates, edgeId, 'active')
  }

  return { nodeStates, edgeStates }
}
