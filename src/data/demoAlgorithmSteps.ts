import type { AlgorithmStep } from '../types/algorithmStep'

export const DEMO_ALGORITHM_STEPS: AlgorithmStep[] = [
  {
    id: 'demo-1',
    description: 'Ready to begin.',
    nodeStates: {
      A: 'start',
    },
  },
  {
    id: 'demo-2',
    description: 'Activate node A.',
    nodeStates: {
      A: 'active',
    },
  },
  {
    id: 'demo-3',
    description: 'Explore neighboring nodes.',
    nodeStates: {
      A: 'visited',
      B: 'frontier',
      C: 'frontier',
    },
    edgeStates: {
      'A-B': 'active',
      'A-C': 'active',
    },
  },
  {
    id: 'demo-4',
    description: 'Continue through the graph.',
    nodeStates: {
      A: 'visited',
      B: 'active',
      C: 'frontier',
      D: 'frontier',
    },
    edgeStates: {
      'A-B': 'visited',
      'A-C': 'active',
      'B-D': 'active',
    },
  },
  {
    id: 'demo-5',
    description: 'Demonstration complete.',
    nodeStates: {
      A: 'visited',
      B: 'visited',
    },
    edgeStates: {
      'A-B': 'visited',
    },
  },
]
