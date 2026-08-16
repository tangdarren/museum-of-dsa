import type { AlgorithmId } from '../types/algorithm'
import type { GraphEdgeStates, GraphNodeStates } from '../types/graph'

export type AlgorithmPreview = {
  nodeStates: GraphNodeStates
  edgeStates: GraphEdgeStates
  showWeights: boolean
}

export const ALGORITHM_PREVIEWS: Record<AlgorithmId, AlgorithmPreview> = {
  bfs: {
    nodeStates: {
      A: 'start',
      B: 'frontier',
      C: 'frontier',
      E: 'visited',
    },
    edgeStates: {
      'A-B': 'active',
      'A-C': 'active',
      'B-E': 'visited',
    },
    showWeights: false,
  },
  dfs: {
    nodeStates: {
      A: 'start',
      B: 'visited',
      D: 'active',
      E: 'visited',
    },
    edgeStates: {
      'A-B': 'path',
      'B-D': 'path',
      'B-E': 'visited',
    },
    showWeights: false,
  },
  dijkstra: {
    nodeStates: {
      A: 'start',
      B: 'visited',
      C: 'visited',
      E: 'active',
    },
    edgeStates: {
      'A-B': 'visited',
      'A-C': 'visited',
      'B-E': 'active',
    },
    showWeights: true,
  },
  astar: {
    nodeStates: {
      A: 'start',
      B: 'visited',
      E: 'frontier',
      G: 'target',
    },
    edgeStates: {
      'A-B': 'visited',
      'B-E': 'active',
      'E-G': 'path',
    },
    showWeights: true,
  },
}
