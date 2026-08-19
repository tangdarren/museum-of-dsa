import type {
  AlgorithmLinkedListSnapshot,
  AlgorithmMetricTable,
} from '../types/algorithmStep'
import type {
  LinkedListAlgorithmState,
  LinkedListData,
  LinkedListMetrics,
  LinkedListMutationPosition,
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

export function getLinkedListTailId(list: LinkedListData): string | null {
  if (list.tailId && list.nodes.some((node) => node.id === list.tailId)) {
    return list.tailId
  }

  const order = getLinkedListNodeOrder(list)
  return order[order.length - 1] ?? null
}

export function createLinkedListState(
  list: LinkedListData,
): LinkedListAlgorithmState {
  return {
    variant: list.variant,
    headId: list.headId,
    tailId:
      list.variant === 'doubly' ? getLinkedListTailId(list) : list.tailId,
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

export function getLinkedListLength(list: LinkedListData): number {
  return getLinkedListNodeOrder(list).length
}

export function getLinkedListNodeLabels(
  nodeIds: readonly string[],
  nodesById: Map<string, LinkedListNode>,
): string[] {
  return nodeIds.map((id) => nodesById.get(id)?.label ?? id)
}

export function formatLinkedListChain(list: LinkedListData): string {
  const order = getLinkedListNodeOrder(list)
  const nodesById = indexLinkedListNodes(list.nodes)
  const labels = getLinkedListNodeLabels(order, nodesById)

  if (labels.length === 0) {
    return 'NULL'
  }

  return `${labels.join(' → ')} → NULL`
}

export function createUniqueLinkedListNodeId(
  nodes: readonly LinkedListNode[],
  value: number,
): string {
  const usedIds = new Set(nodes.map((node) => node.id))
  const baseId = String(value)

  if (!usedIds.has(baseId)) {
    return baseId
  }

  let suffix = 2
  let candidate = `${baseId}-${suffix}`

  while (usedIds.has(candidate)) {
    suffix += 1
    candidate = `${baseId}-${suffix}`
  }

  return candidate
}

export function createLinkedListNode(
  id: string,
  value: number,
  nextId?: string,
  previousId?: string,
): LinkedListNode {
  const node: LinkedListNode = {
    id,
    label: String(value),
    value,
  }

  if (nextId !== undefined) {
    node.nextId = nextId
  }

  if (previousId !== undefined) {
    node.previousId = previousId
  }

  return node
}

export function setLinkedListNext(
  node: LinkedListNode,
  nextId: string | undefined,
) {
  if (nextId === undefined) {
    delete node.nextId
  } else {
    node.nextId = nextId
  }
}

export function setLinkedListPrevious(
  node: LinkedListNode,
  previousId: string | undefined,
) {
  if (previousId === undefined) {
    delete node.previousId
  } else {
    node.previousId = previousId
  }
}

export function getLinkedListReverseNodeOrder(list: LinkedListData): string[] {
  const nodesById = indexLinkedListNodes(list.nodes)
  const order: string[] = []
  const seen = new Set<string>()
  let currentId = getLinkedListTailId(list)

  while (currentId && !seen.has(currentId)) {
    const node = nodesById.get(currentId)

    if (!node) {
      break
    }

    order.push(currentId)
    seen.add(currentId)
    currentId = node.previousId ?? null
  }

  return order
}

export function formatLinkedListReverseChain(list: LinkedListData): string {
  const order = getLinkedListNodeOrder(list)
  const nodesById = indexLinkedListNodes(list.nodes)
  const labels = getLinkedListNodeLabels(order, nodesById)

  if (labels.length === 0) {
    return 'NULL'
  }

  return `NULL ← ${labels.join(' ← ')}`
}

export function getDoublyLinkedListInvariantIssues(
  list: LinkedListData,
): string[] {
  const issues: string[] = []
  const nodesById = indexLinkedListNodes(list.nodes)
  const forwardOrder = getLinkedListNodeOrder(list)
  const reverseOrder = getLinkedListReverseNodeOrder(list)
  const reachableIds = new Set(forwardOrder)

  if (!list.headId) {
    if (list.tailId) {
      issues.push('TAIL should be null when the list is empty.')
    }

    if (list.nodes.length > 0) {
      issues.push('An empty list should not retain nodes.')
    }

    return issues
  }

  const head = nodesById.get(list.headId)

  if (!head) {
    issues.push('HEAD does not refer to a node in the list.')
    return issues
  }

  if (head.previousId) {
    issues.push('head.previous should be null.')
  }

  const tailId = getLinkedListTailId(list)
  const tail = tailId ? nodesById.get(tailId) : undefined

  if (!tail) {
    issues.push('TAIL does not refer to a node in the list.')
  } else if (tail.nextId) {
    issues.push('tail.next should be null.')
  }

  if (list.tailId && tailId && list.tailId !== tailId) {
    issues.push('TAIL does not match the last node in the list.')
  }

  for (const node of list.nodes) {
    if (!reachableIds.has(node.id)) {
      issues.push(`Node ${node.label} is unreachable from HEAD.`)
    }

    if (node.nextId) {
      const next = nodesById.get(node.nextId)

      if (!next) {
        issues.push(`${node.label}.next refers to a missing node.`)
      } else if (next.previousId !== node.id) {
        issues.push(
          `${node.label}.next is ${next.label}, but ${next.label}.previous is not ${node.label}.`,
        )
      }
    }

    if (node.previousId) {
      const previous = nodesById.get(node.previousId)

      if (!previous) {
        issues.push(`${node.label}.previous refers to a missing node.`)
      } else if (previous.nextId !== node.id) {
        issues.push(
          `${node.label}.previous is ${previous.label}, but ${previous.label}.next is not ${node.label}.`,
        )
      }
    }
  }

  if (reverseOrder.join(',') !== [...forwardOrder].reverse().join(',')) {
    issues.push('Forward next links and backward previous links disagree.')
  }

  return issues
}

export function resolveLinkedListInsertIndex(
  position: LinkedListMutationPosition,
  length: number,
): number | null {
  if (position.at === 'head') {
    return 0
  }

  if (position.at === 'tail') {
    return length
  }

  if (
    !Number.isInteger(position.index) ||
    position.index < 0 ||
    position.index > length
  ) {
    return null
  }

  return position.index
}

export function resolveLinkedListDeleteIndex(
  position: LinkedListMutationPosition,
  length: number,
): number | null {
  if (length === 0) {
    return null
  }

  if (position.at === 'head') {
    return 0
  }

  if (position.at === 'tail') {
    return length - 1
  }

  if (
    !Number.isInteger(position.index) ||
    position.index < 0 ||
    position.index >= length
  ) {
    return null
  }

  return position.index
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
