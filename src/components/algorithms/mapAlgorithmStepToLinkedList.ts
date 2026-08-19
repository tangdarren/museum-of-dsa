import type { AlgorithmLinkedListSnapshot } from '../../types/algorithmStep'
import type {
  LinkedListLinkState,
  LinkedListLinkStates,
  LinkedListNodeState,
  LinkedListNodeStates,
} from '../../types/linkedList'

const NODE_STATE_PRIORITY: Record<LinkedListNodeState, number> = {
  default: 0,
  visited: 1,
  highlighted: 2,
  target: 3,
  found: 4,
  active: 5,
  inserting: 6,
  deleting: 7,
}

const LINK_STATE_PRIORITY: Record<LinkedListLinkState, number> = {
  default: 0,
  active: 1,
  changing: 2,
}

export function linkedListLinkId(
  kind: 'next' | 'previous',
  sourceId: string,
): string {
  return `${kind}:${sourceId}`
}

function assignNodeState(
  nodeStates: LinkedListNodeStates,
  nodeId: string,
  state: LinkedListNodeState,
) {
  const current = nodeStates[nodeId] ?? 'default'

  if (NODE_STATE_PRIORITY[state] >= NODE_STATE_PRIORITY[current]) {
    nodeStates[nodeId] = state
  }
}

function assignLinkState(
  linkStates: LinkedListLinkStates,
  linkId: string,
  state: LinkedListLinkState,
) {
  const current = linkStates[linkId] ?? 'default'

  if (LINK_STATE_PRIORITY[state] >= LINK_STATE_PRIORITY[current]) {
    linkStates[linkId] = state
  }
}

export function mapLinkedListSnapshotToStates(
  snapshot: AlgorithmLinkedListSnapshot | null,
): {
  nodeStates: LinkedListNodeStates
  linkStates: LinkedListLinkStates
  headActive: boolean
  tailActive: boolean
} {
  if (!snapshot) {
    return {
      nodeStates: {},
      linkStates: {},
      headActive: false,
      tailActive: false,
    }
  }

  const nodeStates: LinkedListNodeStates = {}
  const linkStates: LinkedListLinkStates = {}

  for (const nodeId of snapshot.visitedNodeIds ?? []) {
    assignNodeState(nodeStates, nodeId, 'visited')
  }

  for (const nodeId of snapshot.highlightedNodeIds ?? []) {
    assignNodeState(nodeStates, nodeId, 'highlighted')
  }

  for (const nodeId of snapshot.comparedNodeIds ?? []) {
    assignNodeState(nodeStates, nodeId, 'highlighted')
  }

  if (snapshot.targetNodeId) {
    assignNodeState(nodeStates, snapshot.targetNodeId, 'target')
  }

  if (snapshot.foundNodeId) {
    assignNodeState(nodeStates, snapshot.foundNodeId, 'found')
  }

  if (snapshot.currentNodeId) {
    assignNodeState(nodeStates, snapshot.currentNodeId, 'active')
  }

  if (snapshot.insertingNodeId) {
    assignNodeState(nodeStates, snapshot.insertingNodeId, 'inserting')
  }

  if (snapshot.deletingNodeId) {
    assignNodeState(nodeStates, snapshot.deletingNodeId, 'deleting')
  }

  let headActive = false
  let tailActive = false

  for (const change of snapshot.pointerChanges ?? []) {
    if (change.pointer === 'head') {
      headActive = true
    }

    if (change.pointer === 'tail') {
      tailActive = true
    }

    if (
      (change.pointer === 'next' || change.pointer === 'previous') &&
      change.fromNodeId
    ) {
      assignLinkState(
        linkStates,
        linkedListLinkId(change.pointer, change.fromNodeId),
        'changing',
      )
    }

    if (change.pointer === 'current' && change.fromNodeId && change.toNodeId) {
      assignLinkState(
        linkStates,
        linkedListLinkId('next', change.fromNodeId),
        'active',
      )
    }
  }

  return {
    nodeStates,
    linkStates,
    headActive,
    tailActive,
  }
}
