import type { AlgorithmMetricTable, AlgorithmTreeSnapshot } from '../types/algorithmStep'
import type { TreeAlgorithmState, TreeData, TreeEdge, TreeMetrics, TreeNode } from '../types/tree'

export type TreeSnapshotHighlights = {
  currentNodeId?: string
  targetNodeId?: string
  visitedNodeIds?: string[]
  frontierNodeIds?: string[]
  pathNodeIds?: string[]
  comparedNodeIds?: string[]
  foundNodeId?: string
  insertingNodeId?: string
  activeEdgeIds?: string[]
  visitedEdgeIds?: string[]
  pathEdgeIds?: string[]
  traversalOrder?: string[]
  targetValue?: number
  comparisonDirection?: 'left' | 'right' | 'equal'
  searchResult?: 'found' | 'not-found'
}

function copyIdList(values?: string[]) {
  return values ? [...values] : undefined
}

export function copyTreeNode(node: TreeNode): TreeNode {
  return {
    id: node.id,
    label: node.label,
    value: node.value,
    leftId: node.leftId,
    rightId: node.rightId,
    parentId: node.parentId,
    position: [node.position[0], node.position[1], node.position[2]],
  }
}

export function copyTreeEdge(edge: TreeEdge): TreeEdge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    side: edge.side,
  }
}

export function copyTreeNodes(nodes: TreeNode[]): TreeNode[] {
  return nodes.map(copyTreeNode)
}

export function copyTreeEdges(edges: TreeEdge[]): TreeEdge[] {
  return edges.map(copyTreeEdge)
}

export function createTreeMetrics(): TreeMetrics {
  return {
    comparisons: 0,
    visits: 0,
  }
}

export function copyTreeMetrics(metrics: TreeMetrics): TreeMetrics {
  return {
    comparisons: metrics.comparisons,
    visits: metrics.visits,
  }
}

export function createTreeState(tree: TreeData): TreeAlgorithmState {
  return {
    rootId: tree.rootId,
    nodes: copyTreeNodes(tree.nodes),
    edges: copyTreeEdges(tree.edges),
    visitedNodeIds: [],
    pathNodeIds: [],
    metrics: createTreeMetrics(),
  }
}

export function indexTreeNodes(nodes: TreeNode[]): Map<string, TreeNode> {
  return new Map(nodes.map((node) => [node.id, node]))
}

export function getTreeNode(
  tree: Pick<TreeData, 'nodes'>,
  nodeId: string,
): TreeNode | undefined {
  return tree.nodes.find((node) => node.id === nodeId)
}

export function findTreeEdgeId(
  tree: Pick<TreeData, 'edges'>,
  sourceId: string,
  targetId: string,
): string | undefined {
  return tree.edges.find(
    (edge) => edge.source === sourceId && edge.target === targetId,
  )?.id
}

export function copyTreeSnapshot(
  snapshot: AlgorithmTreeSnapshot,
): AlgorithmTreeSnapshot {
  return {
    rootNodeId: snapshot.rootNodeId,
    nodes: copyTreeNodes(snapshot.nodes),
    edges: copyTreeEdges(snapshot.edges),
    metrics: copyTreeMetrics(snapshot.metrics),
    currentNodeId: snapshot.currentNodeId,
    targetNodeId: snapshot.targetNodeId,
    visitedNodeIds: copyIdList(snapshot.visitedNodeIds),
    frontierNodeIds: copyIdList(snapshot.frontierNodeIds),
    pathNodeIds: copyIdList(snapshot.pathNodeIds),
    comparedNodeIds: copyIdList(snapshot.comparedNodeIds),
    foundNodeId: snapshot.foundNodeId,
    insertingNodeId: snapshot.insertingNodeId,
    activeEdgeIds: copyIdList(snapshot.activeEdgeIds),
    visitedEdgeIds: copyIdList(snapshot.visitedEdgeIds),
    pathEdgeIds: copyIdList(snapshot.pathEdgeIds),
    traversalOrder: copyIdList(snapshot.traversalOrder),
    targetValue: snapshot.targetValue,
    comparisonDirection: snapshot.comparisonDirection,
    searchResult: snapshot.searchResult,
  }
}

export function createTreeSnapshot(
  state: TreeAlgorithmState,
  highlights: TreeSnapshotHighlights = {},
): AlgorithmTreeSnapshot {
  return {
    rootNodeId: state.rootId,
    nodes: copyTreeNodes(state.nodes),
    edges: copyTreeEdges(state.edges),
    metrics: copyTreeMetrics(state.metrics),
    currentNodeId: highlights.currentNodeId,
    targetNodeId: highlights.targetNodeId,
    visitedNodeIds: copyIdList(
      highlights.visitedNodeIds ?? state.visitedNodeIds,
    ),
    frontierNodeIds: copyIdList(highlights.frontierNodeIds),
    pathNodeIds: copyIdList(highlights.pathNodeIds ?? state.pathNodeIds),
    comparedNodeIds: copyIdList(highlights.comparedNodeIds),
    foundNodeId: highlights.foundNodeId,
    insertingNodeId: highlights.insertingNodeId,
    activeEdgeIds: copyIdList(highlights.activeEdgeIds),
    visitedEdgeIds: copyIdList(highlights.visitedEdgeIds),
    pathEdgeIds: copyIdList(highlights.pathEdgeIds),
    traversalOrder: copyIdList(highlights.traversalOrder),
    targetValue: highlights.targetValue,
    comparisonDirection: highlights.comparisonDirection,
    searchResult: highlights.searchResult,
  }
}

export function createTreeMetricsTable(
  metrics: TreeMetrics,
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
        cells: ['Child checks', String(metrics.comparisons)],
      },
    ],
  }
}
