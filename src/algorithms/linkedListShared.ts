import type {
  AlgorithmLinkedListSnapshot,
  AlgorithmMetricTable,
} from '../types/algorithmStep'
import type {
  LinkedListAlgorithmState,
  LinkedListData,
  LinkedListMetrics,
  LinkedListNode,
  LinkedListPointerChange,
} from '../types/linkedList'

export type LinkedListSnapshotHighlights = {
  nodeOrder?: string[]
  currentNodeId?: string
  targetNodeId?: string
  highlightedNodeIds?: string[]
  visitedNodeIds?: string[]
  comparedNodeIds?: string[]
  foundNodeId?: string
  insertingNodeId?: string
  deletingNodeId?: string
  pointerChanges?: LinkedListPointerChange[]
  phase?: AlgorithmLinkedListSnapshot['phase']
  searchResult?: AlgorithmLinkedListSnapshot['searchResult']
}

function copyIdList(values?: string[]) {
  return values ? [...values] : undefined
}

function copyPointerChange(
  change: LinkedListPointerChange,
): LinkedListPointerChange {
  return {
    pointer: change.pointer,
    fromNodeId: change.fromNodeId,
    toNodeId: change.toNodeId,
  }
}

function copyPointerChanges(changes?: LinkedListPointerChange[]) {
  return changes ? changes.map(copyPointerChange) : undefined
}

export function copyLinkedListNode(node: LinkedListNode): LinkedListNode {
  return {
    id: node.id,
    label: node.label,
    value: node.value,
    nextId: node.nextId,
    previousId: node.previousId,
  }
}

export function copyLinkedListNodes(nodes: LinkedListNode[]): LinkedListNode[] {
  return nodes.map(copyLinkedListNode)
}

export function createLinkedListMetrics(): LinkedListMetrics {
  return {
    comparisons: 0,
    visits: 0,
    pointerUpdates: 0,
  }
}

export function copyLinkedListMetrics(
  metrics: LinkedListMetrics,
): LinkedListMetrics {
  return {
    comparisons: metrics.comparisons,
    visits: metrics.visits,
    pointerUpdates: metrics.pointerUpdates,
  }
}

export function createLinkedListState(
  list: LinkedListData,
): LinkedListAlgorithmState {
  return {
    variant: list.variant,
    headId: list.headId,
    tailId: list.tailId,
    nodes: copyLinkedListNodes(list.nodes),
    visitedNodeIds: [],
    metrics: createLinkedListMetrics(),
  }
}

export function indexLinkedListNodes(
  nodes: LinkedListNode[],
): Map<string, LinkedListNode> {
  return new Map(nodes.map((node) => [node.id, node]))
}

export function getLinkedListNode(
  list: Pick<LinkedListData, 'nodes'>,
  nodeId: string,
): LinkedListNode | undefined {
  return list.nodes.find((node) => node.id === nodeId)
}

export function getLinkedListNodeOrder(list: LinkedListData): string[] {
  const nodesById = indexLinkedListNodes(list.nodes)
  const order: string[] = []
  const seen = new Set<string>()
  let currentId = list.headId

  while (currentId && !seen.has(currentId)) {
    const node = nodesById.get(currentId)

    if (!node) {
      break
    }

    order.push(currentId)
    seen.add(currentId)
    currentId = node.nextId ?? null
  }

  return order
}

export function copyLinkedListSnapshot(
  snapshot: AlgorithmLinkedListSnapshot,
): AlgorithmLinkedListSnapshot {
  return {
    variant: snapshot.variant,
    headId: snapshot.headId,
    tailId: snapshot.tailId,
    nodes: copyLinkedListNodes(snapshot.nodes),
    metrics: copyLinkedListMetrics(snapshot.metrics),
    nodeOrder: copyIdList(snapshot.nodeOrder),
    currentNodeId: snapshot.currentNodeId,
    targetNodeId: snapshot.targetNodeId,
    highlightedNodeIds: copyIdList(snapshot.highlightedNodeIds),
    visitedNodeIds: copyIdList(snapshot.visitedNodeIds),
    comparedNodeIds: copyIdList(snapshot.comparedNodeIds),
    foundNodeId: snapshot.foundNodeId,
    insertingNodeId: snapshot.insertingNodeId,
    deletingNodeId: snapshot.deletingNodeId,
    pointerChanges: copyPointerChanges(snapshot.pointerChanges),
    phase: snapshot.phase,
    searchResult: snapshot.searchResult,
  }
}

export function createLinkedListSnapshot(
  state: LinkedListAlgorithmState,
  highlights: LinkedListSnapshotHighlights = {},
): AlgorithmLinkedListSnapshot {
  return {
    variant: state.variant,
    headId: state.headId,
    tailId: state.tailId,
    nodes: copyLinkedListNodes(state.nodes),
    metrics: copyLinkedListMetrics(state.metrics),
    nodeOrder: copyIdList(
      highlights.nodeOrder ??
        getLinkedListNodeOrder({
          variant: state.variant,
          headId: state.headId,
          tailId: state.tailId,
          nodes: state.nodes,
        }),
    ),
    currentNodeId: highlights.currentNodeId ?? state.currentNodeId,
    targetNodeId: highlights.targetNodeId,
    highlightedNodeIds: copyIdList(highlights.highlightedNodeIds),
    visitedNodeIds: copyIdList(
      highlights.visitedNodeIds ?? state.visitedNodeIds,
    ),
    comparedNodeIds: copyIdList(highlights.comparedNodeIds),
    foundNodeId: highlights.foundNodeId,
    insertingNodeId: highlights.insertingNodeId,
    deletingNodeId: highlights.deletingNodeId,
    pointerChanges: copyPointerChanges(highlights.pointerChanges),
    phase: highlights.phase,
    searchResult: highlights.searchResult,
  }
}

export function createLinkedListMetricsTable(
  metrics: LinkedListMetrics,
): AlgorithmMetricTable {
  return {
    label: 'Metrics',
    columns: ['Metric', 'Count'],
    rows: [
      {
        id: 'visits',
        cells: ['Visits', String(metrics.visits)],
      },
      {
        id: 'comparisons',
        cells: ['Comparisons', String(metrics.comparisons)],
      },
      {
        id: 'pointerUpdates',
        cells: ['Pointer updates', String(metrics.pointerUpdates)],
      },
    ],
  }
}
